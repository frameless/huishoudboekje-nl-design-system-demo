""" GraphQL Gebruikers query """
import os
import graphene
import requests
from graphql import GraphQLError
from flask import request
from hhb_backend.graphql import settings
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
            response = requests.get(f"{settings.TRANSACTIE_SERVICES_URL}/customersatementmessages/")
            if response.status_code != 200:
                raise GraphQLError(f"Upstream API responded: {response.json()}")
            customer_satement_messages = response.json()["data"]
        return customer_satement_messages