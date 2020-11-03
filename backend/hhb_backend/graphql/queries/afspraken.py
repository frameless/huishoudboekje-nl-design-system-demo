""" GraphQL Gebruikers query """
import graphene
import requests
from flask import request
from graphql import GraphQLError
from hhb_backend.graphql import settings
from hhb_backend.graphql.models.afspraak import Afspraak


class AfspraakQuery():
    return_type = graphene.Field(Afspraak, id=graphene.Int(required=True))

    @staticmethod
    async def resolver(root, info, **kwargs):
        return await request.dataloader.afspraken_by_id.load(kwargs["id"])

class AfsprakenQuery():
    return_type = graphene.List(Afspraak, ids=graphene.List(graphene.Int, default_value=[]))

    @staticmethod
    async def resolver(root, info, **kwargs):
        if kwargs["ids"]:
            afspraken = await request.dataloader.afspraken_by_id.load_many(kwargs["ids"])
        else:
            afspraken_response = requests.get(f"{settings.HHB_SERVICES_URL}/afspraken/")
            if afspraken_response.status_code != 200:
                raise GraphQLError(f"Upstream API responded: {afspraken_response.json()}")
            afspraken = afspraken_response.json()["data"]
        return afspraken
