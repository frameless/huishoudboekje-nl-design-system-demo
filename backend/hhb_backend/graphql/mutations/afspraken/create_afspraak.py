""" GraphQL mutation for creating a new Afspraak """

import json

import graphene
import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.models.afspraak import Afspraak
from hhb_backend.graphql.mutations.afspraken import AfspraakInput
from hhb_backend.graphql.utils import convert_hhb_interval_to_iso
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    log_gebruikers_activiteit,
    gebruikers_activiteit_entities,
)


class CreateAfspraak(graphene.Mutation):
    class Arguments:
        input = graphene.Argument(AfspraakInput, required=True)

    ok = graphene.Boolean()
    afspraak = graphene.Field(lambda: Afspraak)

    @property
    def gebruikers_activiteit(self):
        return dict(
            action="Update",
            entities=gebruikers_activiteit_entities(
                result=self, key="afspraak", entity_type="afspraak"
            )
            + gebruikers_activiteit_entities(
                result=self.afspraak, key="gebruiker_id", entity_type="burger"
            )
            + gebruikers_activiteit_entities(
                result=self.afspraak, key="organisatie_id", entity_type="organisatie"
            ),
            after=dict(afspraak=self.afspraak),
        )

    @log_gebruikers_activiteit
    async def mutate(root, info, input, **kwargs):
        """ Create the new Gebruiker/Burger """
        if "interval" in input:
            iso_interval = convert_hhb_interval_to_iso(input["interval"])
            if iso_interval:
                input["interval"] = iso_interval
            else:
                input.pop("interval")

        response = requests.post(f"{settings.HHB_SERVICES_URL}/afspraken/", json=input)
        if response.status_code != 201:
            raise GraphQLError(f"Upstream API responded: {response.json()}")
        afspraak = response.json()["data"]

        return CreateAfspraak(afspraak=afspraak, ok=True)
