""" GraphQL mutation for creating a new Rubriek """

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


class CreateRubriek(graphene.Mutation):
    class Arguments:
        naam = graphene.String()
        grootboekrekening_id = graphene.String()

    ok = graphene.Boolean()
    rubriek = graphene.Field(lambda: Rubriek)

    def gebruikers_activiteit(self, _root, info, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="rubriek", result=self, key="rubriek"
            ),
            after=dict(rubriek=self.rubriek),
        )

    @staticmethod
    @log_gebruikers_activiteit
    async def mutate(_root, _info, **kwargs):
        """ Create the new Rubriek """
        if (
            kwargs["grootboekrekening_id"]
            and len(
                hhb_dataloader().grootboekrekeningen_by_id.load(kwargs['grootboekrekening_id'])
            )
            == 0
        ):
            raise GraphQLError(
                f"Grootboekrekening id [{kwargs['grootboekrekening_id']}] not found."
            )
        post_response = requests.post(
            f"{settings.HHB_SERVICES_URL}/rubrieken/",
            data=json.dumps(kwargs, default=str),
            headers={"Content-type": "application/json"},
        )
        if post_response.status_code != 201:
            raise GraphQLError(f"Upstream API responded: {post_response.json()}")
        return CreateRubriek(rubriek=post_response.json()["data"], ok=True)
