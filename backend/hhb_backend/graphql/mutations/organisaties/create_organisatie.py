""" GraphQL mutation for creating a new Organisatie """
import logging
import graphene

from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.datawriters import hhb_datawriter
from hhb_backend.graphql.models.organisatie import Organisatie
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity
from hhb_backend.graphql.mutations.json_input_validator import JsonInputValidator


class CreateOrganisatieInput(graphene.InputObjectType):
    # org_service elements (required)
    naam = graphene.String()
    kvknummer = graphene.String(required=True)
    vestigingsnummer = graphene.String()


class CreateOrganisatie(graphene.Mutation):
    class Arguments:
        input = graphene.Argument(CreateOrganisatieInput)

    ok = graphene.Boolean()
    organisatie = graphene.Field(lambda: Organisatie)

    @staticmethod
    def mutate(self, info, input: CreateOrganisatieInput):
        """ Create the new Organisatie """
        logging.info(f"Creating organisatie")

        validation_schema = {
            "type": "object",
            "properties": {
                "naam": {"type": "string", "minLength": 1, "maxLength": 100},
                "kvknummer": {"type": "string","pattern": "^([0-9]{8})$"}, #KvkNummer
                "vestigingsnummer": {  "type": "string", "pattern": "^([0-9]{12})$" } #Vestigingsnummer
            },
            "required": []
        }
        JsonInputValidator(validation_schema).validate(input)

        Organisatie.unique_kvk_vestigingsnummer(input.kvknummer, input.get("vestigingsnummer"))
        result = hhb_datawriter().organisaties.post(input)

        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="organisatie", entityId=result["id"])
            ],
            after=dict(organisatie=result),
        )

        return CreateOrganisatie(organisatie=result, ok=True)
