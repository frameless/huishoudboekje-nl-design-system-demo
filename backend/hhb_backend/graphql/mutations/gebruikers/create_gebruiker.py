""" GraphQL mutation for creating a new Gebruiker/Burger """
import json

import graphene
import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.models.gebruiker import Gebruiker
import hhb_backend.graphql.mutations.rekening_input as rekening_input
from hhb_backend.graphql.mutations.rekeningen.create_gebruiker_rekening import create_gebruiker_rekening


class CreateGebruikerInput(graphene.InputObjectType):
    # gebruiker arguments
    email = graphene.String()
    geboortedatum = graphene.Date()
    telefoonnummer = graphene.String()
    rekeningen = graphene.List(lambda: rekening_input.RekeningInput)

    # burger arguments
    achternaam = graphene.String()
    huisnummer = graphene.String()
    postcode = graphene.String()
    straatnaam = graphene.String()
    voorletters = graphene.String()
    voornamen = graphene.String()
    plaatsnaam = graphene.String()


class CreateGebruiker(graphene.Mutation):
    class Arguments:
        input = graphene.Argument(CreateGebruikerInput)

    ok = graphene.Boolean()
    gebruiker = graphene.Field(lambda: Gebruiker)

    def mutate(root, info, **kwargs):
        """ Create the new Gebruiker/Burger """
        input = kwargs.pop("input")
        rekeningen = input.pop("rekeningen", None)
        gebruiker_response = requests.post(
            f"{settings.HHB_SERVICES_URL}/gebruikers/",
            data=json.dumps(input, default=str),
            headers={'Content-type': 'application/json'}
        )
        if gebruiker_response.status_code != 201:
            raise GraphQLError(f"Upstream API responded: {gebruiker_response.json()}")

        gebruiker = gebruiker_response.json()["data"]

        if rekeningen:
            gebruiker['rekeningen'] = []
            for rekening in rekeningen:
                gebruiker['rekeningen'].append(create_gebruiker_rekening(gebruiker['id'], rekening))

        return CreateGebruiker(gebruiker=gebruiker, ok=True)
