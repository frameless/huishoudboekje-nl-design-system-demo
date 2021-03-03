from datetime import datetime

import graphene

import hhb_backend.graphql.models.bank_transaction as bank_transaction_model
from hhb_backend.graphql.dataloaders import hhb_dataloader


class CustomerStatementMessage(graphene.ObjectType):
    """GraphQL CustomerStatementMessage model"""

    id = graphene.Int()
    upload_date = graphene.DateTime()
    filename = graphene.String()

    transaction_reference_number = graphene.String()
    related_reference = graphene.String()
    account_identification = graphene.String()
    sequence_number = graphene.String()
    opening_balance = graphene.Int()
    closing_balance = graphene.Int()
    closing_available_funds = graphene.Int()
    forward_available_balance = graphene.Int()
    bank_transactions = graphene.List(lambda: bank_transaction_model.BankTransaction)

    def resolve_upload_date(root, info):
        value = root.get("upload_date")
        if value:
            return datetime.fromisoformat(value)

    async def resolve_bank_transactions(root, info):
        """ Get bank_transactions when requested """
        if transactions := root.get("bank_transactions"):
            return (
                await hhb_dataloader().bank_transactions_by_id.load_many(transactions)
                or []
            )
