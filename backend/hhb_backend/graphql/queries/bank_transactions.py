""" GraphQL Gebruikers query """
import graphene
import requests
from flask import request
from graphql import GraphQLError
from hhb_backend.graphql import settings
from hhb_backend.graphql.models.bank_transaction import BankTransaction


class BankTransactionQuery():
    return_type = graphene.Field(BankTransaction, id=graphene.Int(required=True))

    @staticmethod
    async def resolver(root, info, **kwargs):
        return await request.dataloader.bank_transaction_by_id.load(kwargs["id"])

class BankTransactionsQuery():
    return_type = graphene.List(BankTransaction, csms=graphene.List(graphene.Int, default_value=[]), ids=graphene.List(graphene.Int, default_value=[]))

    @staticmethod
    async def resolver(root, info, **kwargs):
        if not kwargs["ids"] and not kwargs["csms"]:
            bank_transactions_response = requests.get(f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/")
            if bank_transactions_response.status_code != 200:
                raise GraphQLError(f"Upstream API responded: {bank_transactions_response.json()}")
            bank_transactions = bank_transactions_response.json()["data"]
        else:
            bank_transactions_ids = []
            bank_transactions_csms = []
            print("=============------------=========")
            if kwargs["ids"]:
                bank_transactions_ids = await request.dataloader.bank_transactions_by_id.load_many(kwargs["ids"])
            if kwargs["csms"]:
                print(kwargs["csms"])
                bank_transactions_csms = await request.dataloader.bank_transactions_by_csm.load_many(kwargs["csms"])
            
            print(bank_transactions_ids)
            print(bank_transactions_csms)
            if kwargs["ids"] and kwargs["csms"]:
                bank_transactions = list(set(bank_transactions_ids) & set(bank_transactions_csms))
            else:
                bank_transactions = bank_transactions_ids or bank_transactions_csms
        
        return bank_transactions
