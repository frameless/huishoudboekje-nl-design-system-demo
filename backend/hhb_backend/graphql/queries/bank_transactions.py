""" GraphQL Gebruikers query """

import logging
from hhb_backend.graphql.dataloaders.request_builders.journaalpost_request_builder import JournaalpostGetRequestBuilder
from hhb_backend.graphql.dataloaders.request_builders.transactie_request_builder import TransactionGetRequestBuilder
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


class BankTransactionsSearchQuery:
    return_type = graphene.Field(
        bank_transaction.BankTransactionsPaged,
        offset=graphene.Int(),
        limit=graphene.Int(),
        burger_ids = graphene.List(graphene.Int),
        automatisch_geboekt = graphene.Boolean(),
        min_bedrag = graphene.Int(),
        max_bedrag = graphene.Int(),
        start_date = graphene.String(),
        end_date = graphene.String(),
        ibans = graphene.List(graphene.String),
        only_booked = graphene.Boolean(),
        only_credit = graphene.Boolean()
    )

    @classmethod
    def resolver(cls, _, info, offset=None, limit=None, burger_ids=None, automatisch_geboekt=None, min_bedrag=None,max_bedrag=None, start_date=None, end_date=None, ibans=None, only_booked=None, only_credit=None, **kwargs):
        logging.info(f"Get banktransacties search")

        journaalpostBuilder = JournaalpostGetRequestBuilder()
        transaction_ids = None
        journaalposten = None

        if burger_ids is not None or automatisch_geboekt is not None:

            if burger_ids is not None:
                journaalpostBuilder.by_burger_ids(burger_ids)

            if automatisch_geboekt is not None:
                journaalpostBuilder.by_automatically_booked(automatisch_geboekt)

            journaalposten = hhb_dataloader().journaalposten_concept.load_request(journaalpostBuilder.request).get("journaalposten", {})
            transaction_ids = [journaalpost.get("transaction_id", None) for journaalpost in journaalposten if journaalpost.get("transaction_id", None) is not None]  

        transactionsBuilder = TransactionGetRequestBuilder()

        if transaction_ids is not None:
            transactionsBuilder.by_ids(transaction_ids)

        if min_bedrag is not None or max_bedrag is not None:
            transactionsBuilder.by_bedrag(min_bedrag=min_bedrag, max_bedrag=max_bedrag)

        if start_date is not None or end_date is not None:
            transactionsBuilder.by_date(start_date=start_date, end_date=end_date)

        if ibans is not None:
            transactionsBuilder.by_ibans(ibans)
        
        if only_booked is not None:
            transactionsBuilder.by_booked(only_booked)

        if only_credit is not None:
            transactionsBuilder.by_credit(only_credit)

        if offset is not None and limit is not None:
            transactionsBuilder.paged(limit=limit, offset=offset)

        transactions = hhb_dataloader().transacties_concept.load_request(transactionsBuilder.request)

        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="transactie", entityId=transaction["id"])
                for transaction in transactions.get("banktransactions",[])
            ],
        )

        #This is (maybe) not necessary when batching is implemented but for now it makes it faster :)
        if journaalposten is None:
            transaction_ids = [transaction.get("id", -1) for transaction in transactions.get("banktransactions",[]) if transaction.get("is_geboekt", False)]
            if len(transaction_ids) > 0:
                journaalpostBuilder.by_transation_ids(transation_ids=transaction_ids)
                journaalposten = hhb_dataloader().journaalposten_concept.load_request(journaalpostBuilder.request).get("journaalposten", {})

        if journaalposten is not None:
            for transaction in transactions.get("banktransactions",[]):
                transaction_journaalpost = next((journaalpost for journaalpost in journaalposten if journaalpost["transaction_id"] == transaction["id"]), None)
                if transaction_journaalpost is not None:
                    transaction["journaalpost"] = transaction_journaalpost

        rekeningen = hhb_dataloader().rekeningen.by_ibans([transaction.get("tegen_rekening", "") for transaction in transactions.get("banktransactions",[])])
        for transaction in transactions.get("banktransactions",[]):
            transaction_rekening = next((rekening for rekening in rekeningen if rekening["iban"] == transaction["tegen_rekening"]), None)
            if transaction_rekening is not None:
                transaction["rekening"] = transaction_rekening

        return transactions