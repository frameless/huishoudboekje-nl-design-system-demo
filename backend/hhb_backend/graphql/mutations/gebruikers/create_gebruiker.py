""" GraphQL mutation for creating a new Gebruiker/Burger """
import json
import logging
from datetime import datetime

import graphene
import requests
from dateutil import tz
from graphql import GraphQLError
from flask import request, g

import hhb_backend.graphql.mutations.rekeningen.rekening_input as rekening_input
from hhb_backend.graphql import settings
from hhb_backend.graphql.models.gebruiker import Gebruiker
from hhb_backend.graphql.mutations.rekeningen.utils import create_gebruiker_rekening
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
    log_gebruikers_activiteit,
)


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

    def gebruikers_activiteit(self, _root, info, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="burger", result=self, key="gebruiker"
            )
            + gebruikers_activiteit_entities(
                entity_type="rekening", result=self.gebruiker, key="rekeningen"
            ),
            after=dict(burger=self.gebruiker),
        )

    @staticmethod
    @log_gebruikers_activiteit
    async def mutate(_root, _info, input):
        """ Create the new Gebruiker/Burger """
        rekeningen = input.pop("rekeningen", None)
        response = requests.post(
            f"{settings.HHB_SERVICES_URL}/gebruikers/",
            data=json.dumps(input, default=str),
            headers={"Content-type": "application/json"},
        )
        if response.status_code != 201:
            raise GraphQLError(f"Upstream API responded: {response.json()}")

        gebruiker = response.json()["data"]

        if rekeningen:
            gebruiker["rekeningen"] = [
                create_gebruiker_rekening(gebruiker["id"], rekening)
                for rekening in rekeningen
            ]

        return CreateGebruiker(ok=True, gebruiker=gebruiker)
