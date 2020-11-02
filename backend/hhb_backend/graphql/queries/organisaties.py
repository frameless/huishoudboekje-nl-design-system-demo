""" GraphQL Gebruikers query """
import os
import graphene
import requests
from graphql import GraphQLError
from hhb_backend.graphql import settings
from hhb_backend.graphql.models.organisatie import Organisatie

class OrganisatieQuery():
    return_type = graphene.Field(Organisatie, id=graphene.Int(required=True))

    @staticmethod
    def resolver(root, info, **kwargs):
        response = requests.get(f"{settings.HHB_SERVICES_URL}/organisaties/{kwargs['id']}")
        if response.status_code != 200:
            raise GraphQLError(f"Upstream API responded: {response.json()}")
        return response.json()["data"]

class OrganisatiesQuery():
    return_type = graphene.List(Organisatie, ids=graphene.List(graphene.Int, default_value=[]))
    
    @staticmethod
    def resolver(root, info, **kwargs):
        filter_query = ""
        if "ids" in kwargs:
            filter_query = "?filter_ids=" + ",".join([str(id) for id in kwargs['ids']])
        response = requests.get(f"{settings.HHB_SERVICES_URL}/organisaties/{filter_query}")
        if response.status_code != 200:
            raise GraphQLError(f"Upstream API responded: {response.json()}")
        return response.json()["data"]
