""" GraphQL mutation for deleting a Burger """

import graphene
import requests
from datetime import datetime
from graphql import GraphQLError

from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
import hhb_backend.graphql.models.burger as graphene_burger
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
    log_gebruikers_activiteit,
)


class DeleteBurger(graphene.Mutation):
    class Arguments:
        # burger arguments
        id = graphene.Int(required=True)

    ok = graphene.Boolean()
    previous = graphene.Field(lambda: graphene_burger.Burger)

    @staticmethod
    def mutate(root, info, id):
        """Delete current burger"""
        existing_burger = hhb_dataloader().burgers.load_one(id)
        if not existing_burger:
            raise GraphQLError(f"Burger with id {id} not found")

        afspraken = hhb_dataloader().afspraken.by_burger(id)
        input = {'valid_through': datetime.now().strftime("%Y-%m-%d")}
        for afspraak in afspraken:
            response = requests.post(
                f"{settings.HHB_SERVICES_URL}/afspraken/{afspraak.id}",
                json=input,
            )
            try:
                if not response.ok:
                    raise GraphQLError(f"Upstream API responded: {response.text}")
            except:
                if response.status_code != 201:
                    raise GraphQLError(f"Upstream API responded: {response.text}")

        response = requests.delete(f"{settings.HHB_SERVICES_URL}/burgers/{id}")
        if response.status_code != 204:
            raise GraphQLError(f"Upstream API responded: {response.json()}")

        AuditLogging.create(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="burger", result=previous
            ),
            before=dict(burger=previous),
        )

        return DeleteBurger(ok=True, previous=existing_burger)
