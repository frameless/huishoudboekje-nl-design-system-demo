from typing import List

import graphene
import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models import burger
from hhb_backend.graphql.models import huishouden
from hhb_backend.graphql.mutations.huishoudens.utils import create_new_huishouden
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
    log_gebruikers_activiteit,
)


class DeleteHuishoudenBurger(graphene.Mutation):
    """Mutatie om een burger uit een huishouden te verwijderen."""

    class Arguments:
        huishouden_id = graphene.Int(required=True)
        burger_ids = graphene.List(graphene.Int, required=True)

    ok = graphene.Boolean()
    huishouden = graphene.List(lambda: huishouden.Huishouden)
    previous = graphene.Field(lambda: huishouden.Huishouden)
    burgerIds = graphene.List(lambda: burger.Burger)

    def gebruikers_activiteit(self, _root, info, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="burger", result=self.burgerIds, key="burgers"
            )
            + gebruikers_activiteit_entities(
                entity_type="huishouden", result=self.previous["id"], key="huishouden"
            ),
            before=dict(huishouden=self.previous),
            after=dict(huishouden=self.huishouden),
        )

    @staticmethod
    @log_gebruikers_activiteit
    def mutate(_root, _info, huishouden_id: int, burger_ids: List[int]):
        """Move given burgers to new huishoudens"""
        previous = hhb_dataloader().huishoudens.load_one(huishouden_id)

        if previous is None:
            raise GraphQLError("Huishouden not found")

        new_huishoudens = []

        for burger_id in burger_ids:
            # create new huishouden
            new_huishouden = create_new_huishouden()

            # assign burger to new huishouden
            params = {"huishouden_id": new_huishouden.id}
            response = requests.post(
                f"{settings.HHB_SERVICES_URL}/burgers/{burger_id}",
                json=params,
            )
            if not response.ok:
                raise GraphQLError(f"Upstream API responded: {response.text}")
            new_huishoudens.append(new_huishouden)

        return DeleteHuishoudenBurger(
            ok=True,
            huishouden=new_huishoudens,
            previous=previous,
            burgerIds=burger_ids,
        )
