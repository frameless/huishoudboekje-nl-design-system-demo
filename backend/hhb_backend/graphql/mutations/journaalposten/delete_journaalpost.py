import logging


import graphene
import requests

import hhb_backend.graphql.models.journaalpost as graphene_journaalpost
from graphql import GraphQLError
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.mutations.journaalposten import update_transaction_service_is_geboekt
from hhb_backend.unmatch_paymentrecord_from_transactions import UnMatchPaymentRecordsFromTransactions
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity
from hhb_backend.remove_journalentry_from_signals import RemoveJournalEntryFromSignals


class DeleteJournaalpost(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)

    ok = graphene.Boolean()
    previous = graphene.Field(lambda: graphene_journaalpost.Journaalpost)

    @staticmethod
    def mutate(self, info, id):
        logging.info(f"Deleting journaalpost {id}")
        previous = hhb_dataloader().journaalposten.load_one(id)
        if previous and previous.afspraak_id:
            previous.afspraak = hhb_dataloader().afspraken.load_one(previous.afspraak_id)

        response = requests.delete(
            f"{settings.HHB_SERVICES_URL}/journaalposten/{id}")
        if not response.ok:
            raise GraphQLError(f"Upstream API responded: {response.text}")

        if previous and previous.transaction_uuid:
            transaction = hhb_dataloader().transactions_msq.load_one(previous.transaction_uuid)
            update_transaction_service_is_geboekt(
                transaction, is_geboekt=False)
            UnMatchPaymentRecordsFromTransactions.create(
                [previous.transaction_uuid])

        RemoveJournalEntryFromSignals.create([previous["uuid"]])

        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(
                    entityType="journaalpost", entityId=id),
                GebruikersActiviteitEntity(
                    entityType="afspraak", entityId=previous["afspraak_id"]),
                (  # Todo: does this work? Is this not adding a tuple inside an array? (06-12-2022) Thank god we figured out if it worked or not (21-03-2024)
                    GebruikersActiviteitEntity(
                        entityType="burger", entityId=previous["afspraak"]["burger_id"])
                    if "afspraak" in previous
                    else []
                ),
                GebruikersActiviteitEntity(
                    entityType="transaction", entityId=previous["transaction_uuid"]),
                GebruikersActiviteitEntity(
                    entityType="grootboekrekening", entityId=previous["grootboekrekening_id"])
            ],
            before=dict(journaalpost=previous),
        )

        return DeleteJournaalpost(ok=True, previous=previous)
