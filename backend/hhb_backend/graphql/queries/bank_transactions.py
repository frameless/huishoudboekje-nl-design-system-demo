""" GraphQL Gebruikers query """
import graphene
from flask import request

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
            bank_transactions = request.dataloader.bank_transactions_by_id.get_all_and_cache()
        else:
            bank_transactions_ids = []
            bank_transactions_csms = []
            if kwargs["ids"]:
                bank_transactions_ids = await request.dataloader.bank_transactions_by_id.load_many(kwargs["ids"])
            if kwargs["csms"]:
                [[bank_transactions_csms.append(bt) for bt in res] for res in await request.dataloader.bank_transactions_by_csm.load_many(kwargs["csms"])]
            
            if kwargs["ids"] and kwargs["csms"]:
                bank_transactions = list(set(bank_transactions_ids) & set(bank_transactions_csms))
            else:
                bank_transactions = bank_transactions_ids or bank_transactions_csms
        
        return bank_transactions
