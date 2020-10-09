""" GraphQL mutation for creating a new Gebruiker/Burger """
import os
import json
import graphene
import requests
from graphql import GraphQLError
from hhb_backend.graphql import settings
from hhb_backend.graphql.models.gebruiker import Gebruiker

class CreateGebruiker(graphene.Mutation):
    class Arguments:
        # gebruiker arguments
        email = graphene.String()
        geboortedatum = graphene.String()
        telefoonnummer = graphene.String()
        iban = graphene.String()

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
        """ Create the new Gebruiker/Burger """
        gebruiker_data = {}
        if "email" in kwargs:
            gebruiker_data["email"] = kwargs.pop("email")
        if "geboortedatum" in kwargs:
            gebruiker_data["geboortedatum"] = kwargs.pop("geboortedatum")
        if "telefoonnummer" in kwargs:
            gebruiker_data["telefoonnummer"] = kwargs.pop("telefoonnummer")
        if "iban" in kwargs:
            gebruiker_data["iban"] = kwargs.pop("iban")

        gebruiker_response = requests.post(
            os.path.join(settings.HHB_SERVICES_URL, "gebruikers/"), 
            data=json.dumps(gebruiker_data),
            headers={'Content-type': 'application/json'}
        )
        if gebruiker_response.status_code != 201:
            raise GraphQLError(f"Upstream API responded: {gebruiker_response.json()}")

        gebruiker_id = gebruiker_response.json()["data"]["id"]
        burger_response = requests.post(
            os.path.join(settings.HHB_SERVICES_URL, f"gebruikers/{gebruiker_id}/burger"), 
            data=json.dumps(kwargs),
            headers={'Content-type': 'application/json'}
        )
        if burger_response.status_code != 200:
            raise GraphQLError(f"Upstream API responded: {burger_response.json()}")

        return CreateGebruiker(gebruiker=gebruiker_response.json()["data"], ok=True)
