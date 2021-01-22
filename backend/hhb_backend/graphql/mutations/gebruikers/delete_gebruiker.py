""" GraphQL mutation for deleting a Gebruiker/Burger """
import os

import graphene

from flask import request
import requests
from graphql import GraphQLError
from hhb_backend.graphql import settings
from hhb_backend.graphql.models.gebruiker import Gebruiker
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteit, GebruikersActiviteitEntity, \
    log_gebruikers_activiteit


class DeleteGebruiker(graphene.Mutation):
    class Arguments:
        # gebruiker arguments
        id = graphene.Int(required=True)

    ok = graphene.Boolean()
    previous_gebruiker = graphene.Field(lambda: Gebruiker)

    @property
    def gebruikers_activiteit(self):
        return GebruikersActiviteit(
            action="Delete",
            entities=[GebruikersActiviteitEntity(entity_type="burger", entity_id=self.previous_gebruiker['id'])],
            before=self.previous_gebruiker,
        )

    @log_gebruikers_activiteit
    async def mutate(root, info, id):
        """ Delete current gebruiker """

        previous_gebruiker = await request.dataloader.gebruikers_by_id.load(id)

        delete_response = requests.delete(f"{settings.HHB_SERVICES_URL}/gebruikers/{id}")
        if delete_response.status_code != 204:
            raise GraphQLError(f"Upstream API responded: {delete_response.json()}")
        request.dataloader.gebruikers_by_id.clear(id)
        return DeleteGebruiker(ok=True, previous_gebruiker=previous_gebruiker)
