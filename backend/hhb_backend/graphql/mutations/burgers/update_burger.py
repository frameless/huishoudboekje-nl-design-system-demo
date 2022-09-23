""" GraphQL mutation for updating a Burger """
import json

import graphene
import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.burger import Burger
from hhb_backend.graphql.mutations.huishoudens import huishouden_input as huishouden_input
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
    log_gebruikers_activiteit,
)
from hhb_backend.service.model import burger


class UpdateBurger(graphene.Mutation):
    class Arguments:
        # burger arguments
        id = graphene.Int(required=True)
        bsn = graphene.Int()
        voorletters = graphene.String()
        voornamen = graphene.String()
        achternaam = graphene.String()
        geboortedatum = graphene.String()
        telefoonnummer = graphene.String()
        email = graphene.String()
        straatnaam = graphene.String()
        huisnummer = graphene.String()
        postcode = graphene.String()
        plaatsnaam = graphene.String()
        huishouden = graphene.Argument(lambda: huishouden_input.HuishoudenInput)

    ok = graphene.Boolean()
    burger = graphene.Field(lambda: Burger)
    previous = graphene.Field(lambda: Burger)

    def gebruikers_activiteit(self, _root, info, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="burger", result=self, key="burger"
            )
            + gebruikers_activiteit_entities(
                entity_type="rekening", result=self.burger, key="rekeningen"
            ),
            before=dict(burger=self.previous),
            after=dict(burger=self.burger),
        )

    @staticmethod
    @log_gebruikers_activiteit
    async def mutate(_root, _info, id, **kwargs):
        """ Update the current Gebruiker/Burger """
        previous = hhb_dataloader().burgers.load_one(id)

        response = requests.post(
            f"{settings.HHB_SERVICES_URL}/burgers/{id}",
            data=json.dumps(kwargs),
            headers={"Content-type": "application/json"},
        )
        if response.status_code != 200:
            raise GraphQLError(f"Upstream API responded: {response.json()}")

        updated_burger = burger.Burger(response.json()["data"])

        Burger.bsn_length(updated_burger.bsn)
        Burger.bsn_elf_proef(updated_burger.bsn)

        return UpdateBurger(ok=True, burger=updated_burger, previous=previous)
