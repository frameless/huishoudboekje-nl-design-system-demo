""" GraphQL Gebruikers query """
import graphene
from flask import request

from hhb_backend.graphql.models.customer_statement_message import CustomerStatementMessage


class CustomerStatementMessageQuery():
    return_type = graphene.Field(CustomerStatementMessage, id=graphene.Int(required=True))

    @staticmethod
    async def resolver(root, info, **kwargs):
        return await request.dataloader.csms_by_id.load(kwargs["id"])

class CustomerStatementMessagesQuery():
    return_type = graphene.List(CustomerStatementMessage, ids=graphene.List(graphene.Int, default_value=[]))
    
    @staticmethod
    async def resolver(root, info, **kwargs):
        if kwargs["ids"]:
            customer_satement_messages = await request.dataloader.csms_by_id.load_many(kwargs["ids"])
        else:
            customer_satement_messages = request.dataloader.csms_by_id.get_all_and_cache()
        return customer_satement_messages