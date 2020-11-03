""" GraphQL Gebruikers query """
import os
import graphene
import requests
from graphql import GraphQLError
from flask import request
from hhb_backend.graphql import settings
from hhb_backend.graphql.models.organisatie import Organisatie

class OrganisatieQuery():
    return_type = graphene.Field(Organisatie, id=graphene.Int(required=True))

    @staticmethod
    async def resolver(root, info, **kwargs):
        return await request.dataloader.organisaties_by_id.load(kwargs["id"])

class OrganisatiesQuery():
    return_type = graphene.List(Organisatie, ids=graphene.List(graphene.Int, default_value=[]))
    
    @staticmethod
    async def resolver(root, info, **kwargs):
        if kwargs["ids"]:
            organisaties = await request.dataloader.organisaties_by_id.load_many(kwargs["ids"])
        else:
            response = requests.get(f"{settings.HHB_SERVICES_URL}/organisaties/")
            if response.status_code != 200:
                raise GraphQLError(f"Upstream API responded: {response.json()}")
            organisaties = response.json()["data"]
        return organisaties
