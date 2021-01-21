""" GraphQL mutation for creating a new Gebruiker/Burger """
import json

import graphene
import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.models.gebruiker import Gebruiker
import hhb_backend.graphql.mutations.rekeningen.rekening_input as rekening_input
from hhb_backend.graphql.mutations.rekeningen.utils import create_gebruiker_rekening
from hhb_backend.graphql.utils.gebruikersactiviteiten import entity_list, gebruikersactiviteit


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

        result = gebruiker_response.json()["data"]

        if rekeningen:
            result['rekeningen'] = [create_gebruiker_rekening(result['id'], rekening) for rekening in rekeningen]

        gebruikersactiviteit(
            action='create',
            entities=[{"entityType": "burger", "entityId": result['id']}] +
                     entity_list(result=result, key='rekeningen', entity_type='rekening'),
            before=None,
            after={
                "burger": result,
            })
        return CreateGebruiker(gebruiker=result, ok=True)
