""" GraphQL mutation for deleting a Organisatie """
import logging
from hhb_backend.unmatch_paymentrecord_from_transactions import UnMatchPaymentRecordsFromTransactions
from hhb_backend.remove_journalentry_from_signals import RemoveJournalEntryFromSignals
import graphene
import requests

from graphql import GraphQLError
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.customer_statement_message import (
    CustomerStatementMessage,
)
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity


class DeleteCustomerStatementMessage(graphene.Mutation):
    class Arguments:
        # organisatie arguments
        id = graphene.Int(required=True)

    ok = graphene.Boolean()
    previous = graphene.Field(lambda: CustomerStatementMessage)

    @staticmethod
    def mutate(self, info, id):
        """ Delete current Customer Statement Message """
        logging.info(f"Deleting csm {id}")
        previous = hhb_dataloader().csms.load_one(id)

        if previous is None:
            raise GraphQLError(f"Bankafschrift is al verwijderd")

        transactions = hhb_dataloader().bank_transactions.by_csm(id)
        transaction_ids = [t.id for t in transactions]
        transaction_uuids = [t.uuid for t in transactions]

        journaalposten = hhb_dataloader().journaalposten.by_transactions(transaction_ids)
        uuids = []
        for journaalpost in journaalposten:
            if journaalpost is not None:
                uuids.append(journaalpost["uuid"])
                response = requests.delete(
                    f"{settings.HHB_SERVICES_URL}/journaalposten/{journaalpost['id']}")
                if not response.ok:
                    raise GraphQLError(
                        f"Upstream API responded: {response.text}")

        RemoveJournalEntryFromSignals.create(uuids)
        UnMatchPaymentRecordsFromTransactions.create(transaction_uuids)

        for transaction in transaction_ids:
            response = requests.delete(
                f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/{transaction}")
            if not response.ok:
                raise GraphQLError(f"Upstream API responded: {response.text}")

        delete_response_hhb = requests.delete(
            f"{settings.TRANSACTIE_SERVICES_URL}/customerstatementmessages/{id}"
        )
        if not delete_response_hhb.ok:
            raise GraphQLError(
                f"Upstream API responded: {delete_response_hhb.text}")

        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(
                    entityType="customerStatementMessage", entityId=id)
            ],
            before=dict(customerStatementMessage=previous),
        )

        return DeleteCustomerStatementMessage(ok=True, previous=previous)
