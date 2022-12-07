""" GraphQL mutation for updating a Rubriek """

import json

import graphene
import requests

from graphql import GraphQLError
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.rubriek import Rubriek
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity


class UpdateRubriek(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        naam = graphene.String()
        grootboekrekening_id = graphene.String()

    ok = graphene.Boolean()
    rubriek = graphene.Field(lambda: Rubriek)
    previous = graphene.Field(lambda: Rubriek)

    @staticmethod
    def mutate(self, info, id, **kwargs):
        """ Update a Rubriek """
        previous = hhb_dataloader().rubrieken.load_one(id)
        if (
            kwargs["grootboekrekening_id"]
            and hhb_dataloader().grootboekrekeningen.load_one(kwargs['grootboekrekening_id']) is None
        ):
            raise GraphQLError(
                f"Grootboekrekening id [{kwargs['grootboekrekening_id']}] not found."
            )
        post_response = requests.post(
            f"{settings.HHB_SERVICES_URL}/rubrieken/{id}",
            data=json.dumps(kwargs),
            headers={"Content-type": "application/json"},
        )
        if not post_response.ok:
            raise GraphQLError(f"Upstream API responded: {post_response.text}")

        rubriek = post_response.json()["data"]

        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="rubriek", entityId=id),
            ],
            before=dict(rubriek=previous),
            after=dict(rubriek=rubriek),
        )

        return UpdateRubriek(rubriek=rubriek, previous=previous, ok=True)
