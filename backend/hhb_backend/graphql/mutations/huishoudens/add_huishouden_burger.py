from typing import List

import graphene
import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models import huishouden
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
    log_gebruikers_activiteit,
)
from hhb_backend.graphql.models import burger


class AddHuishoudenBurger(graphene.Mutation):
    """Mutatie om een burger aan een huishouden toe te voegen."""

    class Arguments:
        huishouden_id = graphene.Int(required=True)
        burger_ids = graphene.List(graphene.Int, required=True)

    ok = graphene.Boolean()
    huishouden = graphene.Field(lambda: huishouden.Huishouden)
    previous = graphene.Field(lambda: huishouden.Huishouden)
    burgerIds = graphene.Field(lambda: burger.Burger)

    def gebruikers_activiteit(self, _root, info, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="huishouden", result=self, key="huishouden"
            ) + gebruikers_activiteit_entities(
                entity_type="burger", result=self.burgerIds, key="burgers"
            ),
            before=dict(huishouden=self.previous),
            after=dict(huishouden=self.huishouden),
        )

    @staticmethod
    @log_gebruikers_activiteit
    async def mutate(_root, _info, huishouden_id: int, burger_ids: List[int]):
        """Add burgers to given huishouden"""
        """ Clear the cache since we need to have the most up te date version possible. """
        hhb_dataloader().huishoudens_by_id.clear(huishouden_id)
        previous = await hhb_dataloader().huishoudens_by_id.load(huishouden_id)

        if previous is None:
            raise GraphQLError("Huishouden not found")

        for burger_id in burger_ids:
            params = {"huishouden_id": huishouden_id}

            response = requests.post(
                f"{settings.HHB_SERVICES_URL}/burgers/{burger_id}",
                json=params,
            )
            if not response.ok:
                raise GraphQLError(f"Upstream API responded: {response.text}")

        loaded_huishouden = await hhb_dataloader().huishoudens_by_id.load(huishouden_id)
        return AddHuishoudenBurger(
            ok=True,
            huishouden=loaded_huishouden,
            previous=previous,
            burgerIds=burger_ids,
        )
