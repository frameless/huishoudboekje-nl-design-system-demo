""" GraphQL mutation for creating a new Journaalpost """

import logging
import time
from typing import List, Dict

import graphene

import hhb_backend.graphql.models.afspraak as graphene_afspraak
from graphql import GraphQLError
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.datawriters import hhb_datawriter
from hhb_backend.alarm_evaluation import AlarmEvaluation
from hhb_backend.graphql.models.journaalpost import Journaalpost
from hhb_backend.graphql.mutations.journaalposten import update_transaction_service_is_geboekt
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity
from hhb_backend.service.model import journaalpost
from hhb_backend.match_paymentrecord_to_transaction import MatchJournalentriesToPaymentRecordsProducer


class CreateJournaalpostAfspraakInput(graphene.InputObjectType):
    transaction_uuid = graphene.String(required=True)
    afspraak_id = graphene.Int(required=True)
    is_automatisch_geboekt = graphene.Boolean(required=True)


class CreateJournaalpostGrootboekrekeningInput(graphene.InputObjectType):
    transaction_uuid = graphene.String(required=True)
    grootboekrekening_id = graphene.String(required=True)
    is_automatisch_geboekt = graphene.Boolean(required=True)


class CreateJournaalpostAfspraak(graphene.Mutation):
    class Arguments:
        input = graphene.List(CreateJournaalpostAfspraakInput, required=True)

    ok = graphene.Boolean()
    journaalposten = graphene.List(lambda: Journaalpost)

    @staticmethod
    def mutate(self, info, input: List[CreateJournaalpostAfspraakInput]):
        """ Create the new Journaalpost """
        logging.info(f"Creating journaalpost")
        # Validate that the references exist
        if len(input) == 0:
            raise GraphQLError("empty input")

        transaction_ids = [j.transaction_uuid for j in input]

        transactions = hhb_dataloader().transactions_msq.load(transaction_ids)
        if len(transactions) != len(transaction_ids):
            raise GraphQLError("(some) transactions not found ")


        ibans = [t.tegen_rekening for t in transactions]

        if any(item is None for item in ibans):
            raise GraphQLError(
                f"(some) transactions have no iban")

        rekeningen = hhb_dataloader().rekeningen.by_ibans(ibans)
        if len(transactions) != len(rekeningen):
            rekening_ibans = [r.iban for r in rekeningen]
            unknown_ibans = [
                iban for iban in ibans if iban not in rekening_ibans]
            raise GraphQLError(
                f"(some) transactions have unknown ibans {unknown_ibans}")

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
            json.append(
                {**item, "grootboekrekening_id": rubriek.grootboekrekening_id})

        journaalposten = create_journaalposten(json, afspraken, transactions)

        entities = []
        for j in journaalposten:
            entities.extend([
                GebruikersActiviteitEntity(
                    entityType="journaalpost", entityId=j["id"]),
                GebruikersActiviteitEntity(
                    entityType="afspraak", entityId=j["afspraak"]["id"]),
                GebruikersActiviteitEntity(
                    entityType="burger", entityId=j["afspraak"]["burger_id"])
            ])

        AuditLogging.create(
            action=info.field_name,
            entities=entities,
            after=dict(journaalpost=journaalposten),
        )

        return CreateJournaalpostAfspraak(journaalposten=journaalposten, ok=True)


def create_journaalposten(input, afspraken, transactions):
    transaction_ids = [t.uuid for t in transactions]
    previous = hhb_dataloader().journaalposten.by_transactions(transaction_ids)
    if previous:
        for p in previous:
            p.pop('id')
            p.pop('transaction_id')
            p.pop('uuid')
            input.remove(p)

    if not input:
        # update transactions to is_geboekt=True since they are already in a journaalpost.
        update_transaction_service_is_geboekt(transactions, is_geboekt=True)
        return []

    journaalposten = hhb_datawriter().journaalposten.post(input)

    update_transaction_service_is_geboekt(transactions, is_geboekt=True)

    transactionDict = {obj['uuid']: obj for obj in transactions}

    agreementToAlarm = {}
    alarmToCitizen = {}
    journalEntryToTransaction = []
    affectedCitizens = []
    csm_ids = []

    journalEntriesThatHavePaymentInstruction = []

    for post in journaalposten:
        afspraak = afspraken[journaalpost.Journaalpost(post).afspraak_id]
        transaction = transactionDict[post['transaction_uuid']]
        post["afspraak"] = afspraak
        affectedCitizens.append(afspraak.burger_id)
        if afspraak.alarm_id != None:
            agreementToAlarm[afspraak.uuid] = afspraak.alarm_id
            alarmToCitizen[afspraak.alarm_id] = afspraak.burger_id
            journalEntryToTransaction.append(
                (post,  transaction))
        if afspraak.betaalinstructie != None:
            journalEntriesThatHavePaymentInstruction.append(
                (post, transaction))

    affectedCitizens = list(set(affectedCitizens))
    citizens = hhb_dataloader().burgers.load(affectedCitizens)
    citizenLookup = {citizen["id"]: citizen["uuid"] for citizen in citizens}
    citizensToSaldoCheck = [citizen["uuid"]
                            for citizen in citizens if citizen.saldo_alarm]

    if len(agreementToAlarm) != 0:
        for key, value in alarmToCitizen.items():
            alarmToCitizen[key] = citizenLookup[value]

        csm_ids = list(set(csm_ids))

        # csmIdToUuid = {csm["id"]: csm["uuid"]
        #                for csm in hhb_dataloader().csms.load(csm_ids)}

    AlarmEvaluation.create(
        agreementToAlarm, journalEntryToTransaction, citizensToSaldoCheck, alarmToCitizen)

    MatchJournalentriesToPaymentRecordsProducer.create(
        journalEntriesThatHavePaymentInstruction)

    return journaalposten


class CreateJournaalpostGrootboekrekening(graphene.Mutation):
    """Mutatie om een banktransactie af te letteren op een grootboekrekening."""

    class Arguments:
        input = graphene.Argument(CreateJournaalpostGrootboekrekeningInput)

    ok = graphene.Boolean()
    journaalpost = graphene.Field(lambda: Journaalpost)

    @staticmethod
    def mutate(root, info, input, **_kwargs):
        """ Create the new Journaalpost """
        logging.info(f"Creating journaalpost")
        # Validate that the references exist
        transaction = hhb_dataloader().transactions_msq.load_one(input.transaction_uuid)
        if not transaction:
            raise GraphQLError("transaction not found")

        grootboekrekening = hhb_dataloader().grootboekrekeningen.load_one(
            input.grootboekrekening_id)
        if not grootboekrekening:
            raise GraphQLError("grootboekrekening not found")

        previous = hhb_dataloader().journaalposten.by_transaction(input.transaction_uuid)
        if previous:
            raise GraphQLError(f"Journaalpost already exists for Transaction")

        journaalpost = hhb_datawriter().journaalposten.post(input)

        update_transaction_service_is_geboekt(transaction, is_geboekt=True)

        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(
                    entityType="journaalpost", entityId=journaalpost["id"]),
                GebruikersActiviteitEntity(
                    entityType="transaction", entityId=journaalpost["transaction_uuid"]),
                GebruikersActiviteitEntity(entityType="grootboekrekening",
                                           entityId=journaalpost["grootboekrekening_id"])
            ],
            after=dict(journaalpost=journaalpost),
        )

        return CreateJournaalpostGrootboekrekening(journaalpost=journaalpost, ok=True)
