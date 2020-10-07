""" GraphQL Gebruikers query """
import os
import graphene
import requests
from graphql import GraphQLError
from hhb_backend.graphql import settings
from hhb_backend.graphql.models.gebruiker import Gebruiker

result = graphene.List(Gebruiker)

def resolver(root, info):
    response = requests.get(os.path.join(settings.HHB_SERVICES_URL, "gebruikers/"))
    if response.status_code != 200:
        raise GraphQLError(f"Upstream API responded: {response.json()}")
    return response.json()["data"]
