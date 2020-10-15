""" Gebruiker model as used in GraphQL queries """
import os
import graphene
import requests
from graphql import GraphQLError
from hhb_backend.graphql import settings
from .burger import Burger

class OrganisatieKvK(graphene.ObjectType):
    nummer = graphene.Int()
    naam = graphene.String()
    straatnaam = graphene.String()
    huisnummer = graphene.String()
    postcode = graphene.String()
    plaatsnaam = graphene.String()

    def resolve_nummer(root, info):
        return root.get("kvk_nummer")

class Organisatie(graphene.ObjectType):
    """ GraphQL Gebruiker model """
    id = graphene.Int()
    weergave_naam = graphene.String()
    kvk_nummer = graphene.Int()
    kvk_details = graphene.Field(OrganisatieKvK)

    def resolve_kvk_details(root, info):
        """ Get Burger when requested """
        response = requests.get(
            os.path.join(settings.ORGANISATIE_SERVICES_URL, f"organisaties/{root.get('kvk_nummer')}")
        )
        if response.status_code == 200:
            print(response.json()["data"])
            return response.json()["data"]
        elif response.status_code == 404:
            return None
        else:
            raise GraphQLError(f"Upstream API responded: {response.json()}")
        