""" GraphQL mutatie voor het aanmaken van een Signaal """
import logging
import graphene

import hhb_backend.graphql.models.signaal as graphene_signaal
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.mutations.signalen.signalen import SignaalHelper, CreateSignaalInput
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity
from hhb_backend.graphql.mutations.json_input_validator import JsonInputValidator


class CreateSignaal(graphene.Mutation):
    class Arguments:
        input = graphene.Argument(CreateSignaalInput, required=True)

    ok = graphene.Boolean()
    signaal = graphene.Field(lambda: graphene_signaal.Signaal)

    @staticmethod
    def mutate(self, info, input: CreateSignaalInput):
        """ Mutatie voor het aanmaken van een nieuw Signaal """
        logging.info(f"Creating signaal")

        validation_schema = {
            "type": "object",
            "properties": {
                "alarm_id": {"type": "string","pattern": "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"}, #uuid
                "type": {"type": "string","minlength": 1},
                "actions": { "type": "array",  "items": { "type": "string", "minlength": 1}},
                "context": {"type": "string","minlength": 1}
            },
            "required": []
        }
        JsonInputValidator(validation_schema).validate(input)

        response_signaal = SignaalHelper.create(input)
        signaal = response_signaal.signaal

        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="signaal", entityId=signaal["id"]),
            ],
            after=dict(signaal=signaal),
        )

        return CreateSignaal(signaal=signaal, ok=True)
