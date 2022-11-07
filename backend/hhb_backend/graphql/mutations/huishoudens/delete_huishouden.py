""" GraphQL mutation for deleting a Huishouden """

import graphene
import requests
from graphql import GraphQLError

from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
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

    @staticmethod
    def mutate(root, info, id):
        """ Delete current huishouden """

        previous = hhb_dataloader().huishoudens.load_one(id)
        if not previous:
            raise GraphQLError("Huishouden not found.")

        response = requests.delete(f"{settings.HHB_SERVICES_URL}/huishoudens/{id}")
        if response.status_code != 204:
            raise GraphQLError(f"Upstream API responded: {response.json()}")

        AuditLogging.create(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="huishouden", result=previous
            ),
            before=dict(huishouden=previous),
        )
        return DeleteHuishouden(ok=True, previous=previous)
