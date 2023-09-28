""" GraphQL mutation for updating a Afdeling """
import logging
import graphene
import requests

import hhb_backend.graphql.models.afdeling as graphene_afdeling
from graphql import GraphQLError
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity
from hhb_backend.graphql.mutations.json_input_validator import JsonInputValidator


class UpdateAfdeling(graphene.Mutation):
    class Arguments:
        # hhb_service elements
        id = graphene.Int(required=True)

        # org_service elements
        naam = graphene.String()
        organisatie_id = graphene.Int()

    ok = graphene.Boolean()
    afdeling = graphene.Field(lambda: graphene_afdeling.Afdeling)
    previous = graphene.Field(lambda: graphene_afdeling.Afdeling)

    @staticmethod
    def mutate(root, info, id, **kwargs):
        """ Update the current Afdeling """
        logging.info(f"Updating afdeling: {id}")
        
        validation_schema = {
            "type": "object",
            "properties": {
                "naam": {"type": "string", "minLength": 1}
            },
            "required": []
        }
        JsonInputValidator(validation_schema).validate(kwargs)

        previous = hhb_dataloader().afdelingen.load_one(id)
        if not previous:
            raise GraphQLError("Afdeling not found")

        hhb_service_data = {"organisatie_id": previous.organisatie_id}
        if "organisatie_id" in kwargs:
            hhb_service_data["organisatie_id"] = kwargs["organisatie_id"]

        # Try update of huishoudboekje service
        hhb_service_response = requests.post(
            f"{settings.HHB_SERVICES_URL}/afdelingen/{id}",
            json=hhb_service_data,
            headers={"Content-type": "application/json"},
        )
        if hhb_service_response.status_code != 200:
            raise GraphQLError(
                f"Upstream API responded: {hhb_service_response.text}")

        # Try update of organisatie service
        org_service_response = requests.post(
            f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/{id}",
            json=kwargs,
            headers={"Content-type": "application/json"},
        )
        if org_service_response.status_code != 200:
            raise GraphQLError(
                f"Upstream API responded: {org_service_response.text}"
            )

        afdeling = org_service_response.json()["data"]

        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="afdeling", entityId=id)
            ],
            before=dict(postadres=previous),
            after=dict(afdeling=afdeling),
        )

        return UpdateAfdeling(afdeling=afdeling, previous=previous, ok=True)
