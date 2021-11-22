""" GraphQL mutation for creating a new Afspraak """
from datetime import datetime

import graphene
import requests
from graphql import GraphQLError

from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql import settings
from hhb_backend.graphql.models.afspraak import Afspraak
from hhb_backend.graphql.scalars.bedrag import Bedrag
from hhb_backend.graphql.models.postadres import Postadres
from hhb_backend.graphql.models.burger import Burger
from hhb_backend.graphql.models.rekening import Rekening
from hhb_backend.graphql.models.rubriek import Rubriek
from hhb_backend.graphql.models.afdeling import Afdeling
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    log_gebruikers_activiteit,
    gebruikers_activiteit_entities,
)

class CreateAfspraakInput(graphene.InputObjectType):
    burger_id = graphene.Int(required=True)
    tegen_rekening_id = graphene.Int(required=True)
    rubriek_id = graphene.Int(required=True)
    omschrijving = graphene.String(required=True)
    bedrag = graphene.Argument(Bedrag, required=True)
    credit = graphene.Boolean(required=True)
    afdeling_id = graphene.Int()
    postadres_id = graphene.String()
    valid_from = graphene.String()
    valid_through = graphene.String()


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
                entity_type="afdeling", result=self.afspraak, key="afdeling_id"
            ),
            after=dict(afspraak=self.afspraak),
        )

    @staticmethod
    @log_gebruikers_activiteit
    async def mutate(_root, _info, input: CreateAfspraakInput):
        """ Create the new Afspraak """

        if "valid_from" not in input:
            input["valid_from"] = str(datetime.now().date())

        # check burger_id
        burger_id = input.get("burger_id")
        burger: Burger = (await hhb_dataloader().burgers_by_id.load(burger_id))
        if not burger:
            raise GraphQLError("burger not found")

        # Check tegen_rekening_id
        rekening_id = input.get("tegen_rekening_id")
        rekening: Rekening = (await hhb_dataloader().rekeningen_by_id.load(rekening_id))
        if not rekening:
            raise GraphQLError("rekening not found")

        # check rubriek_id
        rubriek_id = input.get("rubriek_id")
        rubriek: Rubriek = (await hhb_dataloader().rubrieken_by_id.load(rubriek_id))
        if not rubriek:
            raise GraphQLError("rubriek not found")

        # check afdeling_id - optional
        afdeling_id = input.get("afdeling_id")
        if afdeling_id is not None:
            afdeling: Afdeling = (await hhb_dataloader().afdelingen_by_id.load(afdeling_id))
            if not afdeling:
                raise GraphQLError("afdeling not found")

        # Check postadres_id - optional
        postadres_id = input.get("postadres_id")
        if postadres_id is not None:
            url = f"""{settings.CONTACTCATALOGUS_SERVICE_URL}/addresses/{postadres_id}"""
            response = requests.get(url, headers={"Accept": "application/json", "Authorization": "45c1a4b6-59d3-4a6e-86bf-88a872f35845"})
            if response.status_code != 200:
                raise GraphQLError("postadres not found")

        # final create call
        response = requests.post(f"{settings.HHB_SERVICES_URL}/afspraken/", json=input)
        if response.status_code != 201:
            raise GraphQLError(f"Upstream API responded: {response.text}")
        afspraak = response.json()["data"]

        return CreateAfspraak(afspraak=afspraak, ok=True)
