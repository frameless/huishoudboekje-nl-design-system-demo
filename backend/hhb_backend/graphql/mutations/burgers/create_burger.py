""" GraphQL mutation for creating a new Burger """
import json

import graphene
import requests
from graphql import GraphQLError

from hhb_backend.graphql.models.burger import Burger

import hhb_backend.graphql.mutations.rekeningen.rekening_input as rekening_input
import hhb_backend.graphql.mutations.huishoudens.huishouden_input as huishouden_input
from hhb_backend.graphql import settings
from hhb_backend.graphql.mutations.rekeningen.utils import create_burger_rekening
from hhb_backend.graphql.mutations.huishoudens.utils import create_huishouden_if_not_exists
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
    log_gebruikers_activiteit,
)


class CreateBurgerInput(graphene.InputObjectType):
    # burger arguments
    bsn = graphene.Int()
    email = graphene.String()
    geboortedatum = graphene.Date()
    telefoonnummer = graphene.String()
    rekeningen = graphene.List(lambda: rekening_input.RekeningInput)
    achternaam = graphene.String()
    huisnummer = graphene.String()
    postcode = graphene.String()
    straatnaam = graphene.String()
    voorletters = graphene.String()
    voornamen = graphene.String()
    plaatsnaam = graphene.String()
    huishouden = graphene.Field(huishouden_input.HuishoudenInput)

class CreateBurger(graphene.Mutation):
    class Arguments:
        input = graphene.Argument(CreateBurgerInput)

    ok = graphene.Boolean()
    burger = graphene.Field(lambda: Burger)

    def gebruikers_activiteit(self, _root, info, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="burger", result=self, key="burger"
            )
            + gebruikers_activiteit_entities(
                entity_type="rekening", result=self.burger, key="rekeningen"
            ),
            after=dict(burger=self.burger),
        )

    @staticmethod
    @log_gebruikers_activiteit
    async def mutate(_root, _info, input):
        """ Create the new Gebruiker/Burger """
        rekeningen = input.pop("rekeningen", None)

        huishouden = await create_huishouden_if_not_exists(huishouden=input.pop("huishouden", {}))
        input["huishouden_id"] = huishouden["id"]

        response = requests.post(
            f"{settings.HHB_SERVICES_URL}/burgers/",
            data=json.dumps(input, default=str),
            headers={"Content-type": "application/json"},
        )
        if response.status_code != 201:
            raise GraphQLError(f"Upstream API responded: {response.json()}")

        burger = response.json()["data"]

        if rekeningen:
            burger["rekeningen"] = [
                create_burger_rekening(burger["id"], rekening)
                for rekening in rekeningen
            ]

        return CreateBurger(ok=True, burger=burger)
