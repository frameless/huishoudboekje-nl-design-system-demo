""" GraphQL Gebruikers query """
import graphene
from graphql import GraphQLError

import hhb_backend.graphql.models.bank_transaction as bank_transaction
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.filters.bank_transactions import BankTransactionFilter
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
    log_gebruikers_activiteit,
)


class BankTransactionQuery:
    return_type = graphene.Field(bank_transaction.BankTransaction, id=graphene.Int(required=True))

    @classmethod
    def gebruikers_activiteit(cls, _root, info, id, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="transactie", result=id
            ),
        )

    @classmethod
    @log_gebruikers_activiteit
    async def resolver(cls, _root, _info, id):
        return hhb_dataloader().bank_transactions.load_one(id)


class BankTransactionsQuery:
    return_type = graphene.List(
        bank_transaction.BankTransaction,
        filters=BankTransactionFilter()
    )

    @classmethod
    def gebruikers_activiteit(cls, _root, info, *_args, **kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="transactie",
                result=kwargs["result"] if "result" in kwargs else None,
            ),
        )

    @classmethod
    @log_gebruikers_activiteit
    async def resolver(cls, _root, _info, **kwargs):
        return hhb_dataloader().bank_transactions.load_all(filters=kwargs.get("filters", None))


class BankTransactionsPagedQuery:
    return_type = graphene.Field(
        bank_transaction.BankTransactionsPaged,
        start=graphene.Int(),
        limit=graphene.Int(),
        filters=BankTransactionFilter()
    )

    @classmethod
    def gebruikers_activiteit(cls, _root, info, *_args, **kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="transactie",
                result=kwargs["result"] if "result" in kwargs else None,
            ),
        )

    @classmethod
    @log_gebruikers_activiteit
    async def resolver(cls, _root, _info, **kwargs):
        if "start" in kwargs and "limit" in kwargs:
            return hhb_dataloader().bank_transactions.load_paged(
                start=kwargs["start"],
                limit=kwargs["limit"],
                desc=True,
                sorting_column="transactie_datum",
                filters=kwargs.get("filters")
            )
        else:
            raise GraphQLError(f"Query needs params 'start', 'limit'. ")
