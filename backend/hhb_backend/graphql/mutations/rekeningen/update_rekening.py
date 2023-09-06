""" GraphQL mutation for updating an existing Rekening """

import logging
import graphene
import requests

import hhb_backend.graphql.models.rekening as rekening
import hhb_backend.graphql.mutations.rekeningen.rekening_input as rekening_input
from graphql import GraphQLError
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity
from hhb_backend.graphql.mutations.json_input_validator import JsonInputValidator

class UpdateRekening(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        rekening = graphene.Argument(
            lambda: rekening_input.RekeningInput, required=True
        )

    ok = graphene.Boolean()
    rekening = graphene.Field(lambda: rekening.Rekening)
    previous = graphene.Field(lambda: rekening.Rekening)

    @staticmethod
    def mutate(self, info, id, rekening):
        """ Create the new Rekening """
        logging.info(f"Updating rekening {id}")

        validation_schema = {
            "type": "object",
            "properties": {
                "iban": {"type": "string","pattern": "^[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]{0,16})$"}, #IbanNL
                "rekeninghouder": {"type": "string","minlength": 1}
            },
            "required": []
        }
        JsonInputValidator(validation_schema).validate(rekening)

        previous = hhb_dataloader().rekeningen.load_one(id)

        if previous is None:
            raise GraphQLError(f"Rekening not found")

        for k in ["iban", "rekeninghouder"]:
            rekening.setdefault(k, previous[k])

        if previous.iban != rekening["iban"]:
            raise GraphQLError(f"Rekening has different iban")

        response = requests.post(
            f"{settings.HHB_SERVICES_URL}/rekeningen/{id}", json=rekening
        )
        if response.status_code != 200:
            raise GraphQLError(f"Upstream API responded: {response.text}")

        result = response.json()["data"]

        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="rekening", entityId=id),
            ],
            before=dict(rekening=previous),
            after=dict(rekening=result),
        )

        return UpdateRekening(ok=True, rekening=result, previous=previous)
