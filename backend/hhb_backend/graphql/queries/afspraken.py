""" GraphQL Gebruikers query """
import graphene
import requests
from graphql import GraphQLError
from hhb_backend.graphql import settings
from hhb_backend.graphql.models.afspraak import Afspraak


class AfspraakQuery():
    return_type = graphene.Field(Afspraak, id=graphene.Int(required=True))

    @staticmethod
    def resolver(root, info, **kwargs):
        response = requests.get(f"{settings.HHB_SERVICES_URL}/afspraken/{kwargs['id']}")
        if response.status_code != 200:
            raise GraphQLError(f"Upstream API responded: {response.json()}")
        return response.json()["data"]


class AfsprakenQuery():
    return_type = graphene.List(Afspraak, ids=graphene.List(graphene.Int, default_value=[]))

    @staticmethod
    def resolver(root, info, **kwargs):
        filter_query = ""
        if "ids" in kwargs:
            filter_query = "?filter_ids=" + ",".join([str(id) for id in kwargs['ids']])
        response = requests.get(f"{settings.HHB_SERVICES_URL}/afspraken/{filter_query}")
        if response.status_code != 200:
            raise GraphQLError(f"Upstream API responded: {response.json()}")
        return response.json()["data"]
