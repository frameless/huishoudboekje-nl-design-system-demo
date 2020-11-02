""" GraphQL Rekeningen query """
import graphene
import requests
from graphql import GraphQLError
from hhb_backend.graphql import settings
from hhb_backend.graphql.models.rekening import Rekening


class RekeningenGebruikerQuery():
    return_type = graphene.List(Rekening, id=graphene.Int(required=True))

    @staticmethod
    def resolver(root, info, **kwargs):
        response = requests.get(f"{settings.HHB_SERVICES_URL}/gebruikers/{kwargs['id']}/rekeningen")
        if response.status_code != 200:
            raise GraphQLError(f"Upstream API responded: {response.json()}")
        return response.json()["data"]


class RekeningenOrganisatieQuery():
    return_type = graphene.List(Rekening, id=graphene.Int(required=True))

    @staticmethod
    def resolver(root, info, **kwargs):
        response = requests.get(f"{settings.HHB_SERVICES_URL}/organisaties/{kwargs['id']}/rekeningen")
        if response.status_code != 200:
            raise GraphQLError(f"Upstream API responded: {response.json()}")
        return response.json()["data"]