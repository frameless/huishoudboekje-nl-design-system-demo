import os
import graphene
import requests
from datetime import datetime
from hhb_backend.graphql import settings
from .burger import Burger

class Gebruiker(graphene.ObjectType):
    telefoonnummer = graphene.String()
    email = graphene.String()
    geboortedatum = graphene.Date()
    burger = graphene.Field(Burger)

    def resolve_geboortedatum(root, info):
        return datetime.strptime(root.get("geboortedatum"), "%Y-%m-%d").date()
    
    def resolve_burger(root, info):
        response = requests.get(os.path.join(settings.HHB_SERVICES_URL, f"gebruikers/{root.get('id')}/burger"))
        return response.json()["data"]