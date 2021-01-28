""" GraphQL mutation for deleting a Gebruiker/Burger """
import os

import graphene
import requests
from graphql import GraphQLError
from hhb_backend.graphql import settings
from hhb_backend.graphql.models.afspraak import Afspraak
from flask import request

from hhb_backend.graphql.utils.gebruikersactiviteiten import log_gebruikers_activiteit, gebruikers_activiteit_entities


class DeleteAfspraak(graphene.Mutation):
    class Arguments:
        # gebruiker arguments
        id = graphene.Int(required=True)

    ok = graphene.Boolean()

    previous = graphene.Field(lambda: Afspraak)

    @property
    def gebruikers_activiteit(self):
        return dict(
            action="Delete",
            entities=gebruikers_activiteit_entities(result=self, key="previous", entity_type="afspraak") +
                     gebruikers_activiteit_entities(self.previous, "gebruiker_id", entity_type="burger") +
                     gebruikers_activiteit_entities(self.previous, "organisatie_id", entity_type="organisatie"),
            before=dict(afspraak=self.previous),
        )

    @log_gebruikers_activiteit
    async def mutate(root, info, id):
        """ Delete current gebruiker """

        previous = await request.dataloader.afspraken_by_id.load(id)

        delete_response = requests.delete(f"{settings.HHB_SERVICES_URL}/afspraken/{id}")
        if delete_response.status_code != 204:
            raise GraphQLError(f"Upstream API responded: {delete_response.json()}")
        return DeleteAfspraak(ok=True, previous=previous)
