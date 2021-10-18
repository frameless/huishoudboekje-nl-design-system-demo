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
from hhb_backend.graphql.models.rekening import Rekening
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    log_gebruikers_activiteit,
    gebruikers_activiteit_entities,
)


class CreateAfspraakInput(graphene.InputObjectType):
    burger_id = graphene.Int(required=True)
    credit = graphene.Boolean(required=True)
    afdeling_id = graphene.Int(required=True)
    postadres_id = graphene.String(required=True)
    tegen_rekening_id = graphene.Int(required=True)
    rubriek_id = graphene.Int(required=True)
    omschrijving = graphene.String(required=True)
    bedrag = graphene.Argument(Bedrag, required=True)
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

        print(input)

        # Check rekening
        rekening_id = input.get("tegen_rekening_id")
        rekening: Rekening = (
            await hhb_dataloader().rekeningen_by_id.load(
                rekening_id
            )
        )
        if not rekening:
            raise GraphQLError("rekening not found")

        # Check postadres
        postadres_id = input.get("postadres_id")
        postadres: Postadres = (
            await hhb_dataloader().postadressen_by_id.load(
                postadres_id
            )
        )
        if not postadres:
            raise GraphQLError("postadres not found")

        response = requests.post(f"{settings.HHB_SERVICES_URL}/afspraken/", json=input)
        if response.status_code != 201:
            raise GraphQLError(f"Upstream API responded: {response.text}")
        afspraak = response.json()["data"]

        return CreateAfspraak(afspraak=afspraak, ok=True)
