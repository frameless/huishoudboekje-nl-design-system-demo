""" GraphQL mutation for deleting a Burger """

import graphene
import requests
from flask import request
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.models.burger import Burger
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
    log_gebruikers_activiteit,
)


class DeleteBurger(graphene.Mutation):
    class Arguments:
        # burger arguments
        id = graphene.Int(required=True)

    ok = graphene.Boolean()
    previous = graphene.Field(lambda: Burger)

    def gebruikers_activiteit(self, _root, info, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="burger", result=self, key="previous"
            ),
            before=dict(burger=self.previous),
        )

    @staticmethod
    @log_gebruikers_activiteit
    async def mutate(_root, info, id):
        """Delete current burger"""

        existing_burger = await request.dataloader.burgers_by_id.load(id)
        if not existing_burger:
            raise GraphQLError(f"Burger with id {id} not found")

        response = requests.delete(f"{settings.HHB_SERVICES_URL}/burgers/{id}")
        if response.status_code != 204:
            raise GraphQLError(f"Upstream API responded: {response.json()}")

        request.dataloader.burgers_by_id.clear(id)

        return DeleteBurger(ok=True, previous=existing_burger)
