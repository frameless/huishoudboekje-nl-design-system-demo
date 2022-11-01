""" GraphQL mutation for deleting a Rubriek """

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
    def mutate(_root, _info, **_kwargs):
        """ Delete current rubriek """
        id = _kwargs.get("id")
        previous = hhb_dataloader().rubrieken.load_one(id)

        # Check if in use by afspraken
        afspraken = previous.afspraken
        if afspraken:
            raise GraphQLError("Rubriek is used in one or multiple afspraken - deletion is not possible.")

        # Check if in use by journaalposten
        grootboekrekening_id = previous.grootboekrekening_id
        if grootboekrekening_id:
            journaalposten = hhb_dataloader().journaalposten.by_grootboekrekening(grootboekrekening_id)
            if journaalposten:
                raise GraphQLError("Rubriek is part of grootboekrekening that is used by journaalposten - deletion is not possible.")

        delete_response = requests.delete(f"{settings.HHB_SERVICES_URL}/rubrieken/{id}")
        if delete_response.status_code != 204:
            raise GraphQLError(f"Upstream API responded: {delete_response.json()}")
        return DeleteRubriek(ok=True, previous=previous)
