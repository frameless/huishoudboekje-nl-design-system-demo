""" GraphQL mutation for creating a new Afspraak """


import graphene
import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.models.afspraak import Afspraak
from hhb_backend.graphql.scalars.bedrag import Bedrag
from hhb_backend.graphql.utils import convert_hhb_interval_to_iso, convert_hhb_interval_to_relativetime
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    log_gebruikers_activiteit,
    gebruikers_activiteit_entities,
)


class CreateAfspraakInput(graphene.InputObjectType):
    burger_id = graphene.Int(required=True)
    credit = graphene.Boolean(required=True)
    organisatie_id = graphene.Int(required=True)
    tegen_rekening_id = graphene.Int(required=True)
    rubriek_id = graphene.Int(required=True)
    omschrijving = graphene.String(required=True)
    bedrag = graphene.Argument(Bedrag, required=True)


class CreateAfspraak(graphene.Mutation):
    class Arguments:
        input = graphene.Argument(CreateAfspraakInput, required=True)

    ok = graphene.Boolean()
    afspraak = graphene.Field(lambda: Afspraak)

    def gebruikers_activiteit(self, _root, info, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="afspraak", result=self, key="afspraak"
            )
            + gebruikers_activiteit_entities(
                entity_type="burger", result=self.afspraak, key="burger_id"
            )
            + gebruikers_activiteit_entities(
                entity_type="organisatie", result=self.afspraak, key="organisatie_id"
            ),
            after=dict(afspraak=self.afspraak),
        )

    @staticmethod
    @log_gebruikers_activiteit
    async def mutate(_root, _info, input: CreateAfspraakInput):
        """ Create the new Gebruiker/Burger """
        if "interval" in input:
            iso_interval = convert_hhb_interval_to_iso(input["interval"])
            if iso_interval:
                input["interval"] = iso_interval
            else:
                input.pop("interval")

        if "interval" not in input and input["aantal_betalingen"] == 0:
            raise GraphQLError(f"Interval en aantal betalingen kan niet allebei nul zijn.")

        if input["credit"] is False and "automatische_incasso" not in input:
            raise GraphQLError(f"Automatische incasso is verplicht bij uitgaven afspraak")

        if input["credit"] and not("automatische_incasso" not in input):
            raise GraphQLError(f"Automatische incasso is niet mogelijk bij inkomsten afspraak")

        response = requests.post(f"{settings.HHB_SERVICES_URL}/afspraken/", json=input)
        if response.status_code != 201:
            raise GraphQLError(f"Upstream API responded: {response.json()}")
        afspraak = response.json()["data"]

        return CreateAfspraak(afspraak=afspraak, ok=True)
