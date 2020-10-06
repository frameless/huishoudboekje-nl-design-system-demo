import os
import graphene
import requests
from hhb_backend.graphql import settings
from hhb_backend.graphql.models.gebruiker import Gebruiker

result = graphene.List(Gebruiker)

def resolver(root, info):
    response = requests.get(os.path.join(settings.HHB_SERVICES_URL, "gebruikers/"))
    return response.json()["data"]
