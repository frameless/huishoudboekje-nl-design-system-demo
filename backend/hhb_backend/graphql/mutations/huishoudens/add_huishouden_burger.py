import logging
from typing import List

import graphene
import requests

from graphql import GraphQLError
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models import huishouden
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity


class AddHuishoudenBurger(graphene.Mutation):
    """Mutatie om een burger aan een huishouden toe te voegen."""

    class Arguments:
        huishouden_id = graphene.Int(required=True)
        burger_ids = graphene.List(graphene.Int, required=True)

    ok = graphene.Boolean()
    huishouden = graphene.Field(lambda: huishouden.Huishouden)
    previous = graphene.Field(lambda: huishouden.Huishouden)

    @staticmethod
    def mutate(self, info, huishouden_id: int, burger_ids: List[int]):
        """Add burgers to given huishouden"""
        logging.info(f"Adding burger {burger_id} to huishouden {huishouden_id}")
        previous = hhb_dataloader().huishoudens.load_one(huishouden_id)

        if previous is None:
            raise GraphQLError("Huishouden not found")

        entities = [
            GebruikersActiviteitEntity(entityType="huishouden", entityId=huishouden_id)
        ]

        for burger_id in burger_ids:
            params = {"huishouden_id": huishouden_id}

            entities.append(
                GebruikersActiviteitEntity(entityType="burger", entityId=burger_id)
            )

            response = requests.post(
                f"{settings.HHB_SERVICES_URL}/burgers/{burger_id}",
                json=params,
            )
            if not response.ok:
                raise GraphQLError(f"Upstream API responded: {response.text}")

        loaded_huishouden = hhb_dataloader().huishoudens.load_one(huishouden_id)

        AuditLogging.create(
            action=info.field_name,
            entities=entities,
            before=dict(huishouden=previous),
            after=dict(huishouden=loaded_huishouden),
        )

        return AddHuishoudenBurger(
            ok=True,
            huishouden=loaded_huishouden,
            previous=previous,
        )
