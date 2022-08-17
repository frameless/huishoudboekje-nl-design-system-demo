""" GraphQL mutation for updating a Rubriek """

import json

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


class UpdateRubriek(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        naam = graphene.String()
        grootboekrekening_id = graphene.String()

    ok = graphene.Boolean()
    rubriek = graphene.Field(lambda: Rubriek)
    previous = graphene.Field(lambda: Rubriek)

    def gebruikers_activiteit(self, _root, info, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="rubriek", result=self, key="rubriek"
            ),
            before=dict(rubriek=self.rubriek),
            after=dict(rubriek=self.rubriek),
        )

    @staticmethod
    @log_gebruikers_activiteit
    async def mutate(_root, _info, **kwargs):
        """ Update a Rubriek """
        rubriek_id = kwargs.pop("id")

        previous = hhb_dataloader().rubriek_by_id.load(rubriek_id)
        if (
            kwargs["grootboekrekening_id"]
            and hhb_dataloader().grootboekrekeningen_by_id.load(kwargs['grootboekrekening_id']) is None
        ):
            raise GraphQLError(
                f"Grootboekrekening id [{kwargs['grootboekrekening_id']}] not found."
            )
        post_response = requests.post(
            f"{settings.HHB_SERVICES_URL}/rubrieken/{rubriek_id}",
            data=json.dumps(kwargs),
            headers={"Content-type": "application/json"},
        )
        if not post_response.ok:
            raise GraphQLError(f"Upstream API responded: {post_response.text}")
        rubriek = post_response.json()["data"]

        return UpdateRubriek(rubriek=rubriek, previous=previous, ok=True)
