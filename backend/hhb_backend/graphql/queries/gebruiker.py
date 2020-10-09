""" GraphQL Gebruikers query """
import os
import graphene
import requests
from graphql import GraphQLError
from hhb_backend.graphql import settings
from hhb_backend.graphql.models.gebruiker import Gebruiker

class GebruikerQuery():
    return_type = graphene.Field(Gebruiker, id=graphene.Int(required=True))

    def resolver(self, root, info, **kwargs):
        response = requests.get(os.path.join(settings.HHB_SERVICES_URL, f"gebruikers/{kwargs['id']}"))
        if response.status_code != 200:
            raise GraphQLError(f"Upstream API responded: {response.json()}")
        return response.json()["data"]

class GebruikersQuery():
    return_type = graphene.List(Gebruiker, ids=graphene.List(graphene.Int, default_value=[]))
    
    def resolver(self, root, info, **kwargs):
        filter_query = ""
        if "ids" in kwargs:
            filter_query = "?filter_ids=" + ",".join([str(id) for id in kwargs['ids']])
        response = requests.get(os.path.join(
            settings.HHB_SERVICES_URL,
            f"gebruikers/{filter_query}")
        )
        if response.status_code != 200:
            raise GraphQLError(f"Upstream API responded: {response.json()}")
        return response.json()["data"]
