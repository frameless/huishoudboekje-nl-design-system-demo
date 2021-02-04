""" GraphQL mutation for deleting a Gebruiker/Burger """

import graphene
import requests
from flask import request
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.models.gebruiker import Gebruiker
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    log_gebruikers_activiteit,
    gebruikers_activiteit_entities,
)


class DeleteGebruiker(graphene.Mutation):
    class Arguments:
        # gebruiker arguments
        id = graphene.Int(required=True)

    ok = graphene.Boolean()
    previous = graphene.Field(lambda: Gebruiker)

    @property
    def gebruikers_activiteit(self):
        return dict(
            action="deleteGebruiker",
            entities=gebruikers_activiteit_entities(
                entity_type="burger", result=self, key="previous"
            ),
            before=dict(burger=self.previous),
        )

    @log_gebruikers_activiteit
    async def mutate(root, info, id):
        """ Delete current gebruiker """

        previous = await request.dataloader.gebruikers_by_id.load(id)

        response = requests.delete(f"{settings.HHB_SERVICES_URL}/gebruikers/{id}")
        if response.status_code != 204:
            raise GraphQLError(f"Upstream API responded: {response.json()}")

        request.dataloader.gebruikers_by_id.clear(id)

        return DeleteGebruiker(ok=True, previous=previous)
