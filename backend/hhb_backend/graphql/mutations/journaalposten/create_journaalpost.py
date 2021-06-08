""" GraphQL mutation for creating a new Journaalpost """

import graphene
import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.afspraak import Afspraak
from hhb_backend.graphql.models.bank_transaction import BankTransaction
from hhb_backend.graphql.models.grootboekrekening import Grootboekrekening
from hhb_backend.graphql.models.journaalpost import Journaalpost
from hhb_backend.graphql.mutations.journaalposten import update_transaction_service_is_geboekt
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
    log_gebruikers_activiteit,
)


class CreateJournaalpostAfspraakInput(graphene.InputObjectType):
    transaction_id = graphene.Int(required=True)
    afspraak_id = graphene.Int(required=True)
    is_automatisch_geboekt = graphene.Boolean(required=True)


class CreateJournaalpostGrootboekrekeningInput(graphene.InputObjectType):
    transaction_id = graphene.Int(required=True)
    grootboekrekening_id = graphene.String(required=True)
    is_automatisch_geboekt = graphene.Boolean(required=True)


class CreateJournaalpostAfspraak(graphene.Mutation):
    """Create a Journaalpost with an Afspraak"""

    class Arguments:
        input = graphene.Argument(CreateJournaalpostAfspraakInput)

    ok = graphene.Boolean()
    journaalpost = graphene.Field(lambda: Journaalpost)

    def gebruikers_activiteit(self, _root, info, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="journaalpost", result=self, key="journaalpost"
            )
                     + gebruikers_activiteit_entities(
                entity_type="burger",
                result=self.journaalpost["afspraak"],
                key="burger_id",
            )
                     + gebruikers_activiteit_entities(
                entity_type="afspraak", result=self.journaalpost, key="afspraak"
            )
                     + gebruikers_activiteit_entities(
                entity_type="transaction", result=self.journaalpost, key="transaction"
            ),
            after=dict(journaalpost=self.journaalpost),
        )

    @staticmethod
    @log_gebruikers_activiteit
    async def mutate(_root, _info, input: CreateJournaalpostAfspraakInput):
        """ Create the new Journaalpost """
        # Validate that the references exist

        transaction_id = input.get("transaction_id")

        transaction: BankTransaction = (
            await hhb_dataloader().bank_transactions_by_id.load(
                transaction_id
            )
        )
        if not transaction:
            raise GraphQLError("transaction not found")

        previous = await hhb_dataloader().journaalposten_by_transaction.load(
            transaction_id
        )
        if previous:
            raise GraphQLError(f"journaalpost already exists for transaction")

        afspraak: Afspraak = await hhb_dataloader().afspraken_by_id.load(
            input.get("afspraak_id")
        )
        if not afspraak:
            raise GraphQLError("afspraak not found")

        rubriek = await hhb_dataloader().rubrieken_by_id.load(afspraak["rubriek_id"])
        input["grootboekrekening_id"] = rubriek["grootboekrekening_id"]

        response = requests.post(
            f"{settings.HHB_SERVICES_URL}/journaalposten/",
            json=input
        )
        if not response.ok:
            raise GraphQLError(f"Upstream API responded: {response.text}")

        update_transaction_service_is_geboekt(transaction, is_geboekt=True)

        journaalpost = response.json()["data"]
        journaalpost["afspraak"] = afspraak

        return CreateJournaalpostAfspraak(journaalpost=journaalpost, ok=True)


class CreateJournaalpostPerAfspraak(graphene.Mutation):
    """Create a Journaalpost with an Afspraak"""

    class Arguments:
        input = graphene.List(CreateJournaalpostAfspraakInput, required=True)

    ok = graphene.Boolean()
    journaalposten = graphene.List(lambda: Journaalpost)

    def gebruikers_activiteit(self, _root, info, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=[dict(entity_type="journaalpost", entity_id=j["id"]) for j in self.journaalposten]
                     + [dict(entity_type="afspraak", entity_id=j["afspraak"]["id"]) for j in self.journaalposten]
                     + [dict(entity_type="burger", entity_id=j["afspraak"]["burger_id"])
                        for j in self.journaalposten],
            after=dict(journaalpost=self.journaalposten),

        )

    @staticmethod
    @log_gebruikers_activiteit
    async def mutate(_root, _info, input: [CreateJournaalpostAfspraakInput]):
        """ Create the new Journaalpost """
        # Validate that the references exist
        if len(input) == 0:
            raise GraphQLError("empty input")

        transaction_ids = [j["transaction_id"] for j in input]

        transactions: [BankTransaction] = (
            await hhb_dataloader().bank_transactions_by_id.load_many(
                transaction_ids
            )
        )
        for transaction in transactions:
            if transaction is None:
                raise GraphQLError("(some) transactions not found ")

        previous = await hhb_dataloader().journaalposten_by_transaction.load_many(
            transaction_ids
        )
        for transaction in previous:
            if transaction is not None:
                raise GraphQLError(f"(some) journaalposten already exist")

        afspraken: [Afspraak] = await hhb_dataloader().afspraken_by_id.load_many(
            [j["afspraak_id"] for j in input]
        )

        for afspraak in afspraken:
            if afspraak is None:
                raise GraphQLError("(some) afspraken not found ")

        rubrieken = await hhb_dataloader().rubrieken_by_id.load_many(
            [a["rubriek_id"] for a in afspraken]
        )
        json = [
            {**journaalpost, "grootboekrekening_id": rubriek["grootboekrekening_id"]}
            for (journaalpost, rubriek) in zip(input, rubrieken)
        ]

        response = requests.post(
            f"{settings.HHB_SERVICES_URL}/journaalposten/", json=json
        )
        if not response.ok:
            raise GraphQLError(f"Upstream API responded: {response.text}")
        journaalposten = response.json()["data"]
        for journaalpost, afspraak in zip(journaalposten, afspraken):
            journaalpost["afspraak"] = afspraak

        update_transaction_service_is_geboekt(transactions, is_geboekt=True)

        return CreateJournaalpostPerAfspraak(journaalposten=journaalposten, ok=True)



class CreateJournaalpostGrootboekrekening(graphene.Mutation):
    """Create a Journaalpost with a Grootboekrekening"""

    class Arguments:
        input = graphene.Argument(CreateJournaalpostGrootboekrekeningInput)

    ok = graphene.Boolean()
    journaalpost = graphene.Field(lambda: Journaalpost)

    def gebruikers_activiteit(self, _root, info, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="journaalpost", result=self, key="journaalpost"
            )
                     + gebruikers_activiteit_entities(
                entity_type="transaction", result=self.journaalpost, key="transaction"
            )
                     + gebruikers_activiteit_entities(
                entity_type="grootboekrekening",
                result=self.journaalpost,
                key="grootboekrekening_id",
            ),
            after=dict(journaalpost=self.journaalpost),
        )

    @staticmethod
    @log_gebruikers_activiteit
    async def mutate(_root, _info, input, **_kwargs):
        """ Create the new Journaalpost """
        # Validate that the references exist
        transaction_id = input.get("transaction_id")
        transaction: BankTransaction = (
            await hhb_dataloader().bank_transactions_by_id.load(transaction_id)
        )
        if not transaction:
            raise GraphQLError("transaction not found")

        grootboekrekening: Grootboekrekening = (
            await hhb_dataloader().grootboekrekeningen_by_id.load(
                input.get("grootboekrekening_id")
            )
        )
        if not grootboekrekening:
            raise GraphQLError("grootboekrekening not found")

        previous = await hhb_dataloader().journaalposten_by_transaction.load(transaction_id)
        if previous:
            raise GraphQLError(f"Journaalpost already exists for Transaction")

        response = requests.post(
            f"{settings.HHB_SERVICES_URL}/journaalposten/",
            json=input,
        )
        if not response.ok:
            raise GraphQLError(f"Upstream API responded: {response.text}")
        journaalpost = response.json()["data"]

        update_transaction_service_is_geboekt(transaction, is_geboekt=True)

        return CreateJournaalpostGrootboekrekening(journaalpost=journaalpost, ok=True)
