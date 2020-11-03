""" GraphQL Gebruikers query """
import graphene
import requests
from flask import request
from graphql import GraphQLError
from hhb_backend.graphql import settings
import hhb_backend.graphql.models.gebruiker as gebruiker


class GebruikerQuery():
    return_type = graphene.Field(gebruiker.Gebruiker, id=graphene.Int(required=True))

    @staticmethod
    async def resolver(root, info, **kwargs):
        return await request.dataloader.gebruikers_by_id.load(kwargs["id"])


class GebruikersQuery():
    return_type = graphene.List(gebruiker.Gebruiker, ids=graphene.List(graphene.Int, default_value=[]))

    @staticmethod
    async def resolver(root, info, **kwargs):
        if kwargs["ids"]:
            gebruikers = await request.dataloader.gebruikers_by_id.load_many(kwargs["ids"])
        else:
            gebruikers_response = requests.get(f"{settings.HHB_SERVICES_URL}/gebruikers/")
            if gebruikers_response.status_code != 200:
                raise GraphQLError(f"Upstream API responded: {gebruikers_response.json()}")
            gebruikers = gebruikers_response.json()["data"]
        return gebruikers
