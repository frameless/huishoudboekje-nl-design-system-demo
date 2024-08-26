""" GraphQL Gebruikers query """

import logging
from hhb_backend.graphql.dataloaders.request_builders.journaalpost_request_builder import JournaalpostGetRequestBuilder
from hhb_backend.graphql.dataloaders.request_builders.transactie_request_builder import TransactionGetRequestBuilder
import graphene

import hhb_backend.graphql.models.bank_transaction as bank_transaction
from graphql import GraphQLError
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.filters.bank_transactions import BankTransactionFilter, BankTransactionSearchFilter
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity


class BankTransactionQuery:
    return_type = graphene.Field(bank_transaction.BankTransaction, uuid=graphene.String(required=True))

    @classmethod
    def resolver(cls, _, info, uuid):
        logging.info(f"Get banktransactie")
        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="transactie", entityId=uuid)
            ],
        )
        return hhb_dataloader().transactions_msq.load_one(uuid)


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

class BankTransactionsSearchQuery:
    return_type = graphene.Field(
        bank_transaction.BankTransactionsPaged,
        offset=graphene.Int(),
        limit=graphene.Int(),
        filters = BankTransactionSearchFilter()
    )

    @classmethod
    def resolver(cls, _, info, offset=None, limit=None, filters: BankTransactionSearchFilter=None, **kwargs):
        logging.info(f"Get banktransacties search")

        transactionsBuilder = TransactionGetRequestBuilder()
        journaalpostBuilder = JournaalpostGetRequestBuilder()
        transaction_ids = None
        journaalposten = None

        if filters is not None:

            if filters.burger_ids is not None or filters.automatisch_geboekt is not None:
                if filters.burger_ids is not None:
                    journaalpostBuilder.by_burger_ids(filters.burger_ids)

                if filters.automatisch_geboekt is not None:
                    journaalpostBuilder.by_automatically_booked(filters.automatisch_geboekt)

                journaalposten = hhb_dataloader().journaalposten_concept.load_request(journaalpostBuilder.request).get("journaalposten", {})
                transaction_ids = [journaalpost.get("transaction_uuid", None) for journaalpost in journaalposten if journaalpost.get("transaction_uuid", None) is not None]  

            if transaction_ids is not None:
                transactionsBuilder.by_ids(transaction_ids)

            if filters.min_bedrag is not None or filters.max_bedrag is not None:
                transactionsBuilder.by_bedrag(min_bedrag=filters.min_bedrag, max_bedrag=filters.max_bedrag)

            if filters.start_date is not None or filters.end_date is not None:
                transactionsBuilder.by_date(start_date=filters.start_date, end_date=filters.end_date)

            ibans = []

            if filters.organisatie_ids is not None:
                afdelingen = hhb_dataloader().afdelingen.by_organisaties(filters.organisatie_ids)
                afdeling_ids = [afdeling.id for afdeling in afdelingen]
                rekeningen = hhb_dataloader().rekeningen.by_afdelingen(afdeling_ids)
                rekening_ibans = [rekening.iban for rekening in rekeningen]
                ibans.extend(rekening_ibans)

            if filters.ibans is not None:
                ibans.extend(filters.ibans)

            if len(ibans) > 0:
                transactionsBuilder.by_ibans(ibans)
            
            if filters.only_booked is not None:
                transactionsBuilder.by_booked(filters.only_booked)

            if filters.only_credit is not None:
                transactionsBuilder.by_credit(filters.only_credit)

            if filters.zoektermen is not None:
                transactionsBuilder.by_zoektermen(filters.zoektermen)
        
        if offset is not None and limit is not None:
                transactionsBuilder.paged(limit=limit, offset=offset)

        transactions = hhb_dataloader().transactions_msq.load_request(transactionsBuilder.request)
        if transactions is None:
            raise GraphQLError("Did not receive data, try again!")

        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="transactie", entityId=transaction["uuid"])
                for transaction in transactions.get("banktransactions",[])
            ],
        )

        if len(transactions.get("banktransactions",[])) > 0:
            #This is (maybe) not necessary when batching is implemented but for now it makes it faster :)
            if journaalposten is None:
                transaction_ids = [transaction.get("uuid", -1) for transaction in transactions.get("banktransactions",[]) if transaction.get("is_geboekt", False)]
                if len(transaction_ids) > 0:
                    journaalpostBuilder.by_transation_uuids(transation_uuids=transaction_ids)
                    journaalposten = hhb_dataloader().journaalposten_concept.load_request(journaalpostBuilder.request).get("journaalposten", {})

            if journaalposten is not None:
                grootboekrekening_ids = [journaalpost["grootboekrekening_id"] for journaalpost in journaalposten]
                rubrieken = hhb_dataloader().rubrieken.by_grootboekrekeningen(grootboekrekening_ids)
                for journaalpost in journaalposten:
                    journaalpost_rubriek = next((rubriek for rubriek in rubrieken if journaalpost["grootboekrekening_id"] == rubriek["grootboekrekening_id"]), None)
                    if journaalpost_rubriek is not None:
                        journaalpost["rubriek"] = journaalpost_rubriek

            if journaalposten is None:
                journaalposten = []

            for transaction in transactions.get("banktransactions",[]):
                transaction_journaalpost = next((journaalpost for journaalpost in journaalposten if journaalpost["transaction_uuid"] == transaction["uuid"]), -1)
                transaction["journaalpost"] = transaction_journaalpost

            ibans = [transaction.get("tegen_rekening", "") for transaction in transactions.get("banktransactions",[])]
            rekeningen = hhb_dataloader().rekeningen.by_ibans(ibans)
            for transaction in transactions.get("banktransactions",[]):
                transaction_rekening = next((rekening for rekening in rekeningen if rekening["iban"] == transaction["tegen_rekening"]), None)
                transaction["rekening"] = transaction_rekening

        return transactions
