import os
import graphene
import requests
from graphql import GraphQLError
from datetime import datetime
from hhb_backend.graphql import settings
from .burger import Burger

class Gebruiker(graphene.ObjectType):
    id = graphene.Int()
    telefoonnummer = graphene.String()
    email = graphene.String()
    geboortedatum = graphene.String()
    burger = graphene.Field(Burger)

    def resolve_burger(root, info):
        response = requests.get(os.path.join(settings.HHB_SERVICES_URL, f"gebruikers/{root.get('id')}/burger"))
        if response.status_code == 200:
            return response.json()["data"]
        elif response.status_code == 404:
            return None
        else:
            raise GraphQLError(f"Upstream API responded: {burger_response.json()}")
        