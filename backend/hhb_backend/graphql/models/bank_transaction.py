""" BankTransaction model as used in GraphQL queries """
import graphene
from flask import request
import hhb_backend.graphql.models.customer_statement_message as customer_statement_message_model

class BankTransaction(graphene.ObjectType):
    """GraphQL Rekening model"""
    id = graphene.Int()
    customer_statement_message = graphene.Field(lambda: customer_statement_message_model.CustomerStatementMessage)
    statement_line = graphene.String()
    information_to_account_owner = graphene.String()

    async def resolve_customer_statement_message(root, info):
        """ Get customer_statement_message when requested """
        if root.get('customer_statement_message_id'):
            return await request.dataloader.csms_by_id.load(root.get('customer_statement_message_id'))
