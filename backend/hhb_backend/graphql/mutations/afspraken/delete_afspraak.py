""" GraphQL mutation for deleting a Gebruiker/Burger """

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

    @property
    def gebruikers_activiteit(self):
        return dict(
            action="deleteAfspraak",
            entities=gebruikers_activiteit_entities(
                entity_type="afspraak", result=self, key="previous"
            )
            + gebruikers_activiteit_entities(
                entity_type="burger", result=self.previous, key="gebruiker_id"
            )
            + gebruikers_activiteit_entities(
                entity_type="organisatie", result=self.previous, key="organisatie_id"
            ),
            before=dict(afspraak=self.previous),
        )

    @log_gebruikers_activiteit
    async def mutate(root, info, id):
        """ Delete current gebruiker """
        previous = await hhb_dataloader().afspraken_by_id.load(id)

        response = requests.delete(f"{settings.HHB_SERVICES_URL}/afspraken/{id}")
        if response.status_code != 204:
            raise GraphQLError(f"Upstream API responded: {response.text}")

        return DeleteAfspraak(ok=True, previous=previous)
