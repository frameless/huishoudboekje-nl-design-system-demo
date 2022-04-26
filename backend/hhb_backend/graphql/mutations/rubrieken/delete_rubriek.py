""" GraphQL mutation for deleting a Rubriek """
import os

from numpy import empty

import graphene
import requests
from graphql import GraphQLError
from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.rubriek import Rubriek
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
    log_gebruikers_activiteit,
)


class DeleteRubriek(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)

    ok = graphene.Boolean()
    previous = graphene.Field(lambda: Rubriek)

    def gebruikers_activiteit(self, _root, info, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="rubriek", result=self, key="previous"
            ),
            after=dict(rubriek=self.previous),
        )

    @staticmethod
    @log_gebruikers_activiteit
    async def mutate(_root, _info, **_kwargs):
        """ Delete current rubriek """
        id = _kwargs.get("id")
        previous = await hhb_dataloader().rubrieken_by_id.load(id)

        # Check if in use by afspraken
        afspraken = previous.get("afspraken")
        if afspraken:
            raise GraphQLError("Rubriek wordt gebruikt in een of meerdere afspraken - verwijderen is niet mogelijk.")

        # Check if in use by journaalposten
        grootboekrekening_id = previous.get("grootboekrekening_id")
        if grootboekrekening_id:
            journaalposten = requests.get(f"{settings.HHB_SERVICES_URL}/journaalposten/?filter_grootboekrekeningen={grootboekrekening_id}").json()['data']
            if journaalposten:
                raise GraphQLError("Rubriek zit in grootboekrekening die wordt gebruikt in journaalposten - verwijderen is niet mogelijk.")

        delete_response = requests.delete(f"{settings.HHB_SERVICES_URL}/rubrieken/{id}")
        if delete_response.status_code != 204:
            raise GraphQLError(f"Upstream API responded: {delete_response.json()}")
        return DeleteRubriek(ok=True, previous=previous)
