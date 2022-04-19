""" GraphQL mutation for deleting a Organisatie """
import os

import graphene
import requests
from graphql import GraphQLError

from hhb_backend.graphql.mutations.afdelingen.utils import delete_afdeling_util
from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.organisatie import Organisatie
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
    log_gebruikers_activiteit,
)


class DeleteOrganisatie(graphene.Mutation):
    class Arguments:
        # organisatie arguments
        id = graphene.Int(required=True)

    ok = graphene.Boolean()
    previous = graphene.Field(lambda: Organisatie)

    def gebruikers_activiteit(self, _root, info, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="organisatie", result=self, key="previous"
            ),
            before=dict(organisatie=self.previous),
        )

    @log_gebruikers_activiteit
    async def mutate(root, _info, id):
        """ Delete current organisatie """
        previous = await hhb_dataloader().organisaties_by_id.load(id)
        if not previous:
            raise GraphQLError("Organisatie not found")

        afdelingen = await hhb_dataloader().afdelingen_by_organisatie.load(id)
        if afdelingen:
            raise GraphQLError("Organisatie heeft afdelingen - verwijderen is niet mogelijk.")

        response_organisatie = requests.delete(
            f"{settings.ORGANISATIE_SERVICES_URL}/organisaties/{id}"
        )
        if response_organisatie.status_code not in [204, 404]:
            raise GraphQLError(f"Upstream API responded: {response_organisatie.text}")

        return DeleteOrganisatie(ok=True, previous=previous)
