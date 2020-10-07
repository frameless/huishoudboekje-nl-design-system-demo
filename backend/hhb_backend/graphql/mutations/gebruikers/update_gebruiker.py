import os
import graphene
import requests
import json
from hhb_backend.graphql import settings
from hhb_backend.graphql.models.gebruiker import Gebruiker

class UpdateGebruiker(graphene.Mutation):
    class Arguments:
        # gebruiker arguments
        gebruiker_id = graphene.Int(required=True)
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

    def mutate(root, info, gebruiker_id, **kwargs):
        gebruiker_data = {}
        if "email" in kwargs:
            gebruiker_data["email"] = kwargs.pop("email")
        if "geboortedatum" in kwargs:
            gebruiker_data["geboortedatum"] = kwargs.pop("geboortedatum")
        if "telefoonnummer" in kwargs:
            gebruiker_data["telefoonnummer"] = kwargs.pop("telefoonnummer")
        gebruiker_response = requests.patch(
            os.path.join(settings.HHB_SERVICES_URL, f"gebruikers/{gebruiker_id}"),
            data=json.dumps(gebruiker_data),
            headers={'Content-type': 'application/json'}
        )
        if gebruiker_response.status_code != 200:
            print(gebruiker_response.json()) # print error message to screen for now
            return UpdateGebruiker(gebruiker=None, ok=False)
        burger_response = requests.patch(
            os.path.join(settings.HHB_SERVICES_URL, f"gebruikers/{gebruiker_id}/burger"), 
            data=json.dumps(kwargs),
            headers={'Content-type': 'application/json'}
        )
        if burger_response.status_code != 200:
            print(burger_response.json()) # print error message to screen for now
            return UpdateGebruiker(gebruiker=gebruiker_response.json()["data"], ok=False)
        return UpdateGebruiker(gebruiker=gebruiker_response.json()["data"], ok=True)

