""" GraphQL Gebruikers query """

import logging
import graphene

import hhb_backend.graphql.models.bank_transaction as bank_transaction
from graphql import GraphQLError
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.filters.bank_transactions import BankTransactionFilter
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity


class BankTransactionQuery:
    return_type = graphene.Field(bank_transaction.BankTransaction, id=graphene.Int(required=True))

    @classmethod
    def resolver(cls, _, info, id):
        logging.info(f"Get banktransactie")
        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="transactie", entityId=id)
            ],
        )
        return hhb_dataloader().bank_transactions.load_one(id)


class BankTransactionsQuery:
    return_type = graphene.List(bank_transaction.BankTransaction, filters=BankTransactionFilter())

    @classmethod
    def resolver(cls, _, info, **kwargs):
        logging.info(f"Get banktransacties")
        result = hhb_dataloader().bank_transactions.load_all(filters=kwargs.get("filters", None))
        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="transactie", entityId=transaction.id)
                for transaction in result
            ] if "filters" in kwargs else []
        )
        return result


class BankTransactionsPagedQuery:
    return_type = graphene.Field(
        bank_transaction.BankTransactionsPaged,
        start=graphene.Int(),
        limit=graphene.Int(),
        filters=BankTransactionFilter()
    )

    @classmethod
    def resolver(cls, _, info, filters=None, **kwargs):
        logging.info(f"Get banktransacties paged")
        if "start" not in kwargs or "limit" not in kwargs:
            raise GraphQLError(f"Query needs params 'start', 'limit'. ")

        result = hhb_dataloader().bank_transactions.load_paged(
            start=kwargs["start"], limit=kwargs["limit"], desc=True,
            sorting_column="transactie_datum", filters=filters
        )

        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="transactie", entityId=transaction["id"])
                for transaction in result["banktransactions"]
            ],
        )
        return result
