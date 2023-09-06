""" GraphQL mutation for creating a new Saldo """
import json
import logging


import graphene
import requests

import hhb_backend.graphql.models.saldo as graphene_saldo
from graphql import GraphQLError
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql import settings
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity
from hhb_backend.service.model import saldo
from hhb_backend.graphql.scalars.bedrag import Bedrag
from hhb_backend.graphql.mutations.json_input_validator import JsonInputValidator


class CreateSaldoInput(graphene.InputObjectType):
    burger_id = graphene.Int()
    einddatum = graphene.String()
    begindatum = graphene.String()
    saldo = graphene.Argument(Bedrag)


class CreateSaldo(graphene.Mutation):
    class Arguments:
        input = graphene.Argument(CreateSaldoInput)

    ok = graphene.Boolean()
    saldo = graphene.Field(lambda: graphene_saldo.Saldo)

    @staticmethod
    def mutate(self, info, input):
        """ Create the new Saldo """
        logging.info("Creating new saldo...")

        validation_schema = {
            "type": "object",
            "properties": {
                "einddatum":{"type": "string", "pattern": "^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$"}, #date
                "begindatum":{"type": "string", "pattern": "^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$"}, #date
            },
            "required": []
        }
        JsonInputValidator(validation_schema).validate(input)

        response = requests.post(
            f"{settings.HHB_SERVICES_URL}/saldo/",
            data=json.dumps(input, default=str),
            headers={"Content-type": "application/json"},
        )
        if response.status_code != 201:
            raise GraphQLError(f"Upstream API responded: {response.json()}")

        created_saldo = saldo.Saldo(response.json()["data"])
        entities = [
            GebruikersActiviteitEntity(
                entityType="saldo", entityId=created_saldo.id),
        ]

        AuditLogging.create(
            action=info.field_name,
            entities=entities,
            after=dict(saldo=created_saldo),
        )
        return CreateSaldo(ok=True, saldo=created_saldo)
