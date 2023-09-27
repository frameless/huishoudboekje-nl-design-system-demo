""" GraphQL mutation for creating a new Rekening with an Organisation """

import logging
import graphene

import hhb_backend.graphql.models.rekening as graphene_rekening
import hhb_backend.graphql.mutations.rekeningen.rekening_input as rekening_input
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.mutations.rekeningen.utils import create_afdeling_rekening
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity
from hhb_backend.graphql.mutations.json_input_validator import JsonInputValidator


class CreateAfdelingRekening(graphene.Mutation):
    """Mutatie om een rekening aan een afdeling toe te voegen."""

    class Arguments:
        afdeling_id = graphene.Int(required=True)
        rekening = graphene.Argument(
            lambda: rekening_input.RekeningInput, required=True
        )

    ok = graphene.Boolean()
    rekening = graphene.Field(lambda: graphene_rekening.Rekening)

    @staticmethod
    def mutate(self, info, afdeling_id, rekening):
        """ Create the new Rekening """
        logging.info(f"Creating rekening afdeling")

        validation_schema = {
            "type": "object",
            "properties": {
                "rekeninghouder": {"type": "string","minLength": 1,"maxLength": 100}
            },
            "required": []
        }
        JsonInputValidator(validation_schema).validate(rekening)

        result = create_afdeling_rekening(afdeling_id, rekening)

        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="rekening", entityId=result["id"]),
                GebruikersActiviteitEntity(entityType="afdeling", entityId=afdeling_id),
            ],
            after=dict(rekening=result),
        )

        return CreateAfdelingRekening(rekening=result, ok=True)
