import os
import graphene
import requests
import json
from hhb_backend.graphql import settings
from hhb_backend.graphql.models.gebruiker import Gebruiker

class CreateGebruiker(graphene.Mutation):
    class Arguments:
        # gebruiker arguments
        email = graphene.String()
        geboortedatum = graphene.String()
        telefoonnummer = graphene.String()

        # burger arguments
        achternaam = graphene.String()
        huisnummer = graphene.String()
        postcode = graphene.String()
        straatnaam = graphene.String()
        voorletters = graphene.String()
        voornamen = graphene.String()
        woonplaatsnaam = graphene.String()


    ok = graphene.Boolean()
    gebruiker = graphene.Field(lambda: Gebruiker)

    def mutate(root, info, **kwargs):
        gebruiker_data = {
            "email": kwargs.pop("email"),
            "geboortedatum": kwargs.pop("geboortedatum"),
            "telefoonnummer": kwargs.pop("telefoonnummer"),
        }
        gebruiker_response = requests.post(
            os.path.join(settings.HHB_SERVICES_URL, "gebruikers/"), 
            data=json.dumps(gebruiker_data),
            headers={'Content-type': 'application/json'}
        )
        if gebruiker_response.status_code != 201:
            print(gebruiker_response.json()) # print error message to screen for now
            return CreateGebruiker(gebruiker=None, ok=False)
        gebruiker_id = gebruiker_response.json()["data"]["id"]
        burger_response = requests.post(
            os.path.join(settings.HHB_SERVICES_URL, f"gebruikers/{gebruiker_id}/burger"), 
            data=json.dumps(kwargs),
            headers={'Content-type': 'application/json'}
        )
        if burger_response.status_code != 201:
            print(burger_response.json()) # print error message to screen for now
            return CreateGebruiker(gebruiker=gebruiker_response.json()["data"], ok=False)
        return CreateGebruiker(gebruiker=gebruiker_response.json()["data"], ok=True)
