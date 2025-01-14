import logging
import graphene
import requests

from graphql import GraphQLError
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.configuratie import Configuratie
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity
from hhb_backend.graphql.mutations.json_input_validator import JsonInputValidator


class ConfiguratieInput(graphene.InputObjectType):
    id = graphene.String(required=True)
    waarde = graphene.String()


class CreateConfiguratie(graphene.Mutation):
    class Arguments:
        input = graphene.Argument(ConfiguratieInput)

    ok = graphene.Boolean()
    configuratie = graphene.Field(lambda: Configuratie)

    @staticmethod
    def mutate(self, info, input):
        logging.info(f"Creating configuatie")

        validation_schema = {
            "type": "object",
            "properties": {
                "id": {"type": "string", "minLength": 1},
                "waarde": {"type": "string", "minLength": 1},
            },
            "required": []
        }
        JsonInputValidator(validation_schema).validate(input)

        post_response = requests.post(
            f"{settings.HHB_SERVICES_URL}/configuratie",
            json=input,
        )
        if not post_response.ok:
            raise GraphQLError(f"Upstream API responded: {post_response.text}")

        configuratie = post_response.json()["data"]

        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="configuratie", entityId=configuratie["id"])
            ],
            after=dict(configuratie=configuratie),
        )

        return CreateConfiguratie(configuratie=configuratie, ok=True)


class UpdateConfiguratie(graphene.Mutation):
    class Arguments:
        input = graphene.Argument(ConfiguratieInput)

    ok = graphene.Boolean()
    configuratie = graphene.Field(lambda: Configuratie)
    previous = graphene.Field(lambda: Configuratie)

    @staticmethod
    def mutate(self, info, input, **_kwargs):
        validation_schema = {
            "type": "object",
            "properties": {
                "id": {"type": "string", "minLength": 1},
                "waarde": {"type": "string", "minLength": 1},
            },
            "required": []
        }
        JsonInputValidator(validation_schema).validate(input)

        previous = hhb_dataloader().configuraties.load_one(input.id)

        response = requests.post(
            f"{settings.HHB_SERVICES_URL}/configuratie/{input.id}",
            json=input,
        )
        if not response.ok:
            raise GraphQLError(f"Upstream API responded: {response.text}")

        configuratie = response.json()["data"]

        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="configuratie", entityId=input.id)
            ],
            before=dict(configuratie=previous),
            after=dict(configuratie=configuratie),
        )

        return UpdateConfiguratie(ok=True, configuratie=configuratie, previous=previous)


class DeleteConfiguratie(graphene.Mutation):
    class Arguments:
        id = graphene.String(required=True)

    ok = graphene.Boolean()
    previous = graphene.Field(lambda: Configuratie)

    @staticmethod
    def mutate(self, info, id):
        validation_schema = {"type": "string", "minLength": 1}
        JsonInputValidator(validation_schema).validate(id)
        previous = hhb_dataloader().configuraties.load_one(id)

        response = requests.delete(f"{settings.HHB_SERVICES_URL}/configuratie/{id}")
        if not response.ok:
            raise GraphQLError(f"Upstream API responded: {response.text}")

        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="configuratie", entityId=id)
            ],
            before=dict(configuratie=previous),
        )

        return DeleteConfiguratie(ok=True, previous=previous)
