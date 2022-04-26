""" GraphQL mutation for deleting a Afspraak """

import graphene
import requests
from flask import request
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.afspraak import Afspraak
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    log_gebruikers_activiteit,
    gebruikers_activiteit_entities,
)


class DeleteAfspraak(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)

    ok = graphene.Boolean()

    previous = graphene.Field(lambda: Afspraak)

    def gebruikers_activiteit(self, _root, info, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="afspraak", result=self, key="previous"
            )
            + gebruikers_activiteit_entities(
                entity_type="burger", result=self.previous, key="burger_id"
            )
            + gebruikers_activiteit_entities(
                entity_type="afdeling", result=self.previous, key="afdeling_id"
            ),
            before=dict(afspraak=self.previous),
        )

    @staticmethod
    @log_gebruikers_activiteit
    async def mutate(_root, _info, id):
        """ Delete current afspraak """
        previous = await hhb_dataloader().afspraken_by_id.load(id)

        # Check if afspraak in use by journaalposten
        journaalposten = previous.get("journaalposten")
        if journaalposten:
            raise GraphQLError(f"Afspraak is aan een of meerdere journaalposten gekoppeld - verwijderen is niet mogelijk.")

        response = requests.delete(f"{settings.HHB_SERVICES_URL}/afspraken/{id}")
        if response.status_code != 204:
            raise GraphQLError(f"Upstream API responded: {response.text}")

        return DeleteAfspraak(ok=True, previous=previous)
