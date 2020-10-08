""" GraphQL Gebruikers query """
import os
import graphene
import requests
from graphql import GraphQLError
from hhb_backend.graphql import settings
from hhb_backend.graphql.models.gebruiker import Gebruiker

class GebruikersQuery(graphene.ObjectType):
    gebruiker = graphene.Field(Gebruiker, id=graphene.Int(required=True))
    gebruikers = graphene.List(Gebruiker, ids=graphene.List(graphene.Int, default_value=[]))

    def resolve_gebruiker(root, info, id):
        response = requests.get(os.path.join(settings.HHB_SERVICES_URL, f"gebruikers/{id}"))
        if response.status_code != 200:
            raise GraphQLError(f"Upstream API responded: {response.json()}")
        return response.json()["data"]

    def resolve_gebruikers(root, info, ids):
        filter_query = ""
        if ids:
            filter_query = "?filter_ids=" + ",".join([str(id) for id in ids])
        response = requests.get(os.path.join(
            settings.HHB_SERVICES_URL,
            f"gebruikers/{filter_query}")
        )
        if response.status_code != 200:
            raise GraphQLError(f"Upstream API responded: {response.json()}")
        return response.json()["data"]
