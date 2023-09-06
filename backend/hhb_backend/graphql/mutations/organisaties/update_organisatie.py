""" GraphQL mutation for updating a Organisatie """
import logging
import graphene
import requests

from graphql import GraphQLError
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.organisatie import Organisatie
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity
from hhb_backend.graphql.mutations.json_input_validator import JsonInputValidator


class UpdateOrganisatie(graphene.Mutation):
    class Arguments:
        # org_service elements
        id = graphene.Int(required=True)
        naam = graphene.String()
        kvknummer = graphene.String()
        vestigingsnummer = graphene.String()

    ok = graphene.Boolean()
    organisatie = graphene.Field(lambda: Organisatie)
    previous = graphene.Field(lambda: Organisatie)

    @staticmethod
    def mutate(self, info, id, **kwargs):
        """ Update the current Organisatie """
        logging.info(f"Updating organisatie {id}")

        validation_schema = {
            "type": "object",
            "properties": {
                "naam": {"type": "string", "minlength": 1, "maxlength": 100},
                "kvknummer": {"type": "string","pattern": "^([0-9]{8})$"}, #KvkNummer
                "vestigingsnummer": {  "type": "string", "pattern": "^([0-9]{12})$" } #Vestigingsnummer
            },
            "required": []
        }
        JsonInputValidator(validation_schema).validate(kwargs)

        previous = hhb_dataloader().organisaties.load_one(id)
        if not previous:
            raise GraphQLError("Organisatie not found")

        Organisatie.unique_kvk_vestigingsnummer(kwargs.get("kvknummer"), kwargs.get("vestigingsnummer"), id)

        organisatie = previous
        # Try update of organisatie service
        if kwargs:
            org_service_response = requests.post(
                f"{settings.ORGANISATIE_SERVICES_URL}/organisaties/{id}",
                json=kwargs,
            )
            if org_service_response.status_code != 200:
                raise GraphQLError(
                    f"Upstream API responded: {org_service_response}"
                )

            organisatie = org_service_response.json()["data"]

        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="organisatie", entityId=id)
            ],
            before=dict(organisatie=previous),
            after=dict(organisatie=organisatie),
        )

        return UpdateOrganisatie(organisatie=organisatie, previous=previous, ok=True)
