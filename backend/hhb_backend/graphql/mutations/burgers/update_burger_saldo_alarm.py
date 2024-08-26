""" GraphQL mutation for updating a Burger """
import json
import logging

import graphene
import requests

import hhb_backend.graphql.models.burger as graphene_burger
from graphql import GraphQLError
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.mutations.huishoudens import huishouden_input as huishouden_input
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity
from hhb_backend.service.model import burger
from hhb_backend.graphql.mutations.json_input_validator import JsonInputValidator
from hhb_backend.graphql.mutations.validators import before_today


class UpdateBurgerSaldoAlarm(graphene.Mutation):
    class Arguments:
        # burger arguments
        id = graphene.Int(required=True)
        saldo_alarm = graphene.Boolean()

    ok = graphene.Boolean()
    burger = graphene.Field(lambda: graphene_burger.Burger)
    previous = graphene.Field(lambda: graphene_burger.Burger)

    @staticmethod
    def mutate(self, info, id, **kwargs):
        """ Update the current Gebruiker/Burger """
        logging.info(f"Updating burger {id}")

        validation_schema = {
            "type": "object",
            "properties": {
                "saldo_alarm": {"type": "boolean"},
            },
            "required": []
        }

        JsonInputValidator(validation_schema).validate(kwargs)
        previous = hhb_dataloader().burgers.load_one(id)
        kwargs["id"] = id
        response = requests.post(
            f"{settings.HHB_SERVICES_URL}/burgers/saldo_alarm/{id}",
            data=json.dumps(kwargs),
            headers={"Content-type": "application/json"},
        )
        if response.status_code != 200:
            raise GraphQLError(f"Upstream API responded: {response.json()}")

        updated_burger = burger.Burger(response.json()["data"])

        entities = [
            GebruikersActiviteitEntity(entityType="burger", entityId=id),
        ]

        AuditLogging.create(
            action=info.field_name,
            entities=entities,
            before=dict(burger=previous),
            after=dict(burger=updated_burger),
        )

        return UpdateBurgerSaldoAlarm(ok=True, burger=updated_burger, previous=previous)
