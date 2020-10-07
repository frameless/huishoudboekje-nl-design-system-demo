""" Gebruiker model as used in GraphQL queries """
import os
import graphene
import requests
from graphql import GraphQLError
from hhb_backend.graphql import settings
from .burger import Burger

class Gebruiker(graphene.ObjectType):
    """ GraphQL Gebruiker model """
    id = graphene.Int()
    telefoonnummer = graphene.String()
    email = graphene.String()
    geboortedatum = graphene.String()
    burger = graphene.Field(Burger)

    def resolve_burger(root, info):
        """ Get Burger when requested """
        response = requests.get(os.path.join(settings.HHB_SERVICES_URL, f"gebruikers/{root.get('id')}/burger"))
        if response.status_code == 200:
            return response.json()["data"]
        elif response.status_code == 404:
            return None
        else:
            raise GraphQLError(f"Upstream API responded: {response.json()}")
        