""" GraphQL mutation for deleting a Huishouden """

import graphene
import requests
from flask import request
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.models.huishouden import Huishouden
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    log_gebruikers_activiteit,
    gebruikers_activiteit_entities,
)


class DeleteHuishouden(graphene.Mutation):
    class Arguments:
        # huishouden arguments
        id = graphene.Int(required=True)

    ok = graphene.Boolean()
    previous = graphene.Field(lambda: Huishouden)

    def gebruikers_activiteit(self, _root, info, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="huishouden", result=self, key="previous"
            ),
            before=dict(huishouden=self.previous),
        )

    @staticmethod
    @log_gebruikers_activiteit
    async def mutate(_root, info, id):
        """ Delete current huishouden """

        previous = await request.dataloader.huishoudens_by_id.load(id)

        response = requests.delete(f"{settings.HHB_SERVICES_URL}/huishoudens/{id}")
        if response.status_code != 204:
            raise GraphQLError(f"Upstream API responded: {response.json()}")

        request.dataloader.huishoudens_by_id.clear(id)

        return DeleteHuishouden(ok=True, previous=previous)
