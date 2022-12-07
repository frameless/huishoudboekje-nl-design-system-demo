""" GraphQL mutation for creating a new Rubriek """

import json

import graphene
import requests

from graphql import GraphQLError
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.rubriek import Rubriek
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity


class CreateRubriek(graphene.Mutation):
    class Arguments:
        naam = graphene.String()
        grootboekrekening_id = graphene.String()

    ok = graphene.Boolean()
    rubriek = graphene.Field(lambda: Rubriek)

    @staticmethod
    def mutate(self, info, **kwargs):
        """ Create the new Rubriek """
        if (
            kwargs["grootboekrekening_id"]
            and hhb_dataloader().grootboekrekeningen.load_one(kwargs['grootboekrekening_id']) is None
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

        rubriek = post_response.json()["data"]

        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="rubriek", entityId=rubriek["id"]),
            ],
            after=dict(rubriek=rubriek),
        )

        return CreateRubriek(rubriek=rubriek, ok=True)
