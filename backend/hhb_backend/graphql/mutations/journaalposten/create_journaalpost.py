""" GraphQL mutation for creating a new Journaalpost """

import graphene
import logging
from graphql import GraphQLError
from typing import List, Dict

from hhb_backend.feature_flags import Unleash
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.datawriters import hhb_datawriter
import hhb_backend.graphql.models.afspraak as graphene_afspraak
from hhb_backend.graphql.models.journaalpost import Journaalpost
from hhb_backend.graphql.mutations.alarmen.evaluate_alarm import evaluate_alarms
from hhb_backend.graphql.mutations.journaalposten import update_transaction_service_is_geboekt
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
    log_gebruikers_activiteit,
)
from hhb_backend.service.model import journaalpost


class CreateJournaalpostAfspraakInput(graphene.InputObjectType):
    transaction_id = graphene.Int(required=True)
    afspraak_id = graphene.Int(required=True)
    is_automatisch_geboekt = graphene.Boolean(required=True)


class CreateJournaalpostGrootboekrekeningInput(graphene.InputObjectType):
    transaction_id = graphene.Int(required=True)
    grootboekrekening_id = graphene.String(required=True)
    is_automatisch_geboekt = graphene.Boolean(required=True)


class CreateJournaalpostAfspraak(graphene.Mutation):
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
    def mutate(_root, _info, input: List[CreateJournaalpostAfspraakInput]):
        """ Create the new Journaalpost """
        # Validate that the references exist
        if len(input) == 0:
            raise GraphQLError("empty input")

        transaction_ids = [j.transaction_id for j in input]

        transactions = hhb_dataloader().bank_transactions.load(transaction_ids)
        if len(transactions) != len(transaction_ids):
            raise GraphQLError("(some) transactions not found ")

        previous = hhb_dataloader().journaalposten.by_transactions(transaction_ids)
        if previous:
            raise GraphQLError(f"(some) journaalposten already exist")

        afspraken: Dict[int, graphene_afspraak.Afspraak] = hhb_dataloader().afspraken.load(
            [j.afspraak_id for j in input],
            return_indexed="id"
        )

        input_afspraak_ids = set([j.afspraak_id for j in input])
        if len(afspraken) != len(input_afspraak_ids):
            raise GraphQLError("(some) afspraken not found ")

        rubrieken = hhb_dataloader().rubrieken.load(
            [a.rubriek_id for a in afspraken.values()],
            return_indexed="id"
        )

        json = []
        for item in input:
            afspraak = afspraken[item.afspraak_id]
            rubriek = rubrieken[afspraak.rubriek_id]
            json.append({**item, "grootboekrekening_id": rubriek.grootboekrekening_id})

        journaalposten = create_journaalposten(json, afspraken, transactions)

        return CreateJournaalpostAfspraak(journaalposten=journaalposten, ok=True)

async def create_journaalposten(input, afspraken, transactions):
    transaction_ids = [t.id for t in transactions]
    previous = hhb_dataloader().journaalposten.by_transactions(transaction_ids)
    if previous:
        for p in previous:
            p.pop('id')
            input.remove(p)

    if not input:
        # update transactions to is_geboekt=True since they are already in a journaalpost.
        update_transaction_service_is_geboekt(transactions, is_geboekt=True)
        return []

    journaalposten = hhb_datawriter().journaalposten.post(input)
    
    alarm_ids = []
    for post in journaalposten:
        afspraak = afspraken[journaalpost.Journaalpost(post).afspraak_id]
        post["afspraak"] = afspraak
        if afspraak.alarm_id:
            alarm_ids.append(afspraak.alarm_id)

    update_transaction_service_is_geboekt(transactions, is_geboekt=True)

    # Feature flag: signalen
    if Unleash().is_enabled("signalen"):
        logging.info("create_journaalpost mutation: Evaluating alarms...")
        if alarm_ids:
            await evaluate_alarms(alarm_ids)
    else:
        logging.info("create_journaalpost mutation: Skipping alarm evaluation.")
    
    return journaalposten

class CreateJournaalpostGrootboekrekening(graphene.Mutation):
    """Mutatie om een banktransactie af te letteren op een grootboekrekening."""

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
    def mutate(_root, _info, input, **_kwargs):
        """ Create the new Journaalpost """
        # Validate that the references exist
        transaction = hhb_dataloader().bank_transactions.load_one(input.transaction_id)
        if not transaction:
            raise GraphQLError("transaction not found")

        grootboekrekening = hhb_dataloader().grootboekrekeningen.load_one(input.grootboekrekening_id)
        if not grootboekrekening:
            raise GraphQLError("grootboekrekening not found")

        previous = hhb_dataloader().journaalposten.by_transaction(input.transaction_id)
        if previous:
            raise GraphQLError(f"Journaalpost already exists for Transaction")

        journaalpost = hhb_datawriter().journaalposten.post(input)

        update_transaction_service_is_geboekt(transaction, is_geboekt=True)

        return CreateJournaalpostGrootboekrekening(journaalpost=journaalpost, ok=True)
