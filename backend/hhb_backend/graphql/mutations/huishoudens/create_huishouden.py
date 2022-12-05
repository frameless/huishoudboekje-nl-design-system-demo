""" GraphQL mutation for creating a new Huishouden """

import graphene
import requests
from graphql import GraphQLError

from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.huishouden import Huishouden
from hhb_backend.graphql.mutations.burgers.utils import (
    update_existing_burger,
)
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity
from hhb_backend.service.model import huishouden


class CreateHuishoudenInput(graphene.InputObjectType):
    burger_ids = graphene.List(graphene.Int, required=False)


class CreateHuishouden(graphene.Mutation):
    class Arguments:
        input = graphene.Argument(CreateHuishoudenInput, required=False)

    ok = graphene.Boolean()
    huishouden = graphene.Field(lambda: Huishouden)

    @staticmethod
    def mutate(self, info, input: CreateHuishoudenInput):
        """Create a new Huishouden"""
        response = requests.post(
            f"{settings.HHB_SERVICES_URL}/huishoudens/", json=input
        )
        if response.status_code != 201:
            raise GraphQLError(f"Upstream API responded: {response.text}")
        created_huishouden = huishouden.Huishouden(response.json()["data"])

        if input:
            for burger_id in input.burger_ids:
                burger = hhb_dataloader().burgers.load_one(burger_id)
                if not burger:
                    raise GraphQLError(
                        f"Burger with id {burger_id} not found"
                    )
                update_burger = {'id': burger_id, 'huishouden_id': created_huishouden.id}

                update_existing_burger(burger=update_burger)

        AuditLogging.create(
            action=info.field_name,
            entities=(GebruikersActiviteitEntity(entityType="huishouden", result=created_huishouden.id)),
            after=dict(huishouden=created_huishouden),
        )

        return CreateHuishouden(huishouden=created_huishouden, ok=True)
