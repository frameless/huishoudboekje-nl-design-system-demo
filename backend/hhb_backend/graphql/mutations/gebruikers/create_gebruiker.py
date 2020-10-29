""" GraphQL mutation for creating a new Gebruiker/Burger """
import json

import graphene
import requests
from graphql import GraphQLError
from hhb_backend.graphql import settings
from hhb_backend.graphql.models.gebruiker import Gebruiker
from hhb_backend.graphql.mutations.rekening_input import RekeningInput


class CreateGebruiker(graphene.Mutation):
    class Arguments:
        # gebruiker arguments
        email = graphene.String()
        geboortedatum = graphene.String()
        telefoonnummer = graphene.String()
        rekeningen = graphene.List(RekeningInput)

        # burger arguments
        achternaam = graphene.String()
        huisnummer = graphene.String()
        postcode = graphene.String()
        straatnaam = graphene.String()
        voorletters = graphene.String()
        voornamen = graphene.String()
        plaatsnaam = graphene.String()

    ok = graphene.Boolean()
    gebruiker = graphene.Field(lambda: Gebruiker)

    def mutate(root, info, **kwargs):
        """ Create the new Gebruiker/Burger """
        if "rekeningen" in kwargs:
            rekeningen = kwargs.pop("rekeningen")
        gebruiker_response = requests.post(
            f"{settings.HHB_SERVICES_URL}/gebruikers/",
            data=json.dumps(kwargs),
            headers={'Content-type': 'application/json'}
        )
        if gebruiker_response.status_code != 201:
            raise GraphQLError(f"Upstream API responded: {gebruiker_response.json()}")

        # TODO:
        # - lookup existing rekeningen
        # - add new rekeningen
        # - add gebruiker_rekening that are now connected

        return CreateGebruiker(gebruiker=gebruiker_response.json()["data"], ok=True)
