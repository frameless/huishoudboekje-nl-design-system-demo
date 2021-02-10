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
                key="gebruiker_id",
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
        transaction: BankTransaction = (
            await hhb_dataloader().bank_transactions_by_id.load(
                input.get("transaction_id")
            )
        )
        if not transaction:
            raise GraphQLError("transaction not found")

        afspraak: Afspraak = await hhb_dataloader().afspraken_by_id.load(
            input.get("afspraak_id")
        )
        if not afspraak:
            raise GraphQLError("afspraak not found")

        if not (afspraak["credit"] == transaction["is_credit"]):
            raise GraphQLError(f"credit in afspraak and transaction do not match")

        previous = await hhb_dataloader().journaalposten_by_transaction.load(
            input.get("transaction_id")
        )
        if previous:
            raise GraphQLError(f"journaalpost already exists for transaction")

        response = requests.post(
            f"{settings.HHB_SERVICES_URL}/journaalposten/", json=input
        )
        if not response.ok:
            raise GraphQLError(f"Upstream API responded: {response.text}")

        journaalpost = response.json()["data"]
        journaalpost["afspraak"] = afspraak

        return CreateJournaalpostAfspraak(journaalpost=journaalpost, ok=True)


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
        transaction: BankTransaction = (
            await hhb_dataloader().bank_transactions_by_id.load(
                input.get("transaction_id")
            )
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

        if not (grootboekrekening["credit"] == transaction["is_credit"]):
            raise GraphQLError(f"credit in afspraak and transaction do not match")

        previous = await hhb_dataloader().journaalposten_by_transaction.load(
            input.get("transaction_id")
        )
        if previous:
            raise GraphQLError(f"Journaalpost already exists for Transaction")

        response = requests.post(
            f"{settings.HHB_SERVICES_URL}/journaalposten/",
            json=input,
        )
        if not response.ok:
            raise GraphQLError(f"Upstream API responded: {response.text}")
        journaalpost = response.json()["data"]
        return CreateJournaalpostGrootboekrekening(journaalpost=journaalpost, ok=True)
