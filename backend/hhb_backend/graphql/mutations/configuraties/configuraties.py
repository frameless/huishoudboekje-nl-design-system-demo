import graphene
import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.configuratie import Configuratie
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
    log_gebruikers_activiteit,
)


class ConfiguratieInput(graphene.InputObjectType):
    id = graphene.String(required=True)
    waarde = graphene.String()


class CreateConfiguratie(graphene.Mutation):
    class Arguments:
        input = graphene.Argument(ConfiguratieInput)

    ok = graphene.Boolean()
    configuratie = graphene.Field(lambda: Configuratie)

    def gebruikers_activiteit(self, _root, info, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="configuratie", result=self, key="configuratie"
            ),
            after=dict(configuratie=self.configuratie),
        )

    @staticmethod
    @log_gebruikers_activiteit
    async def mutate(_root, _info, input):
        post_response = requests.post(
            f"{settings.HHB_SERVICES_URL}/configuratie",
            json=input,
        )
        if not post_response.ok:
            raise GraphQLError(f"Upstream API responded: {post_response.text}")

        return CreateConfiguratie(configuratie=post_response.json()["data"], ok=True)


class UpdateConfiguratie(graphene.Mutation):
    class Arguments:
        input = graphene.Argument(ConfiguratieInput)

    ok = graphene.Boolean()
    configuratie = graphene.Field(lambda: Configuratie)
    previous = graphene.Field(lambda: Configuratie)

    def gebruikers_activiteit(self, _root, info, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="configuratie", result=self, key="configuratie"
            ),
            before=dict(configuratie=self.previous),
            after=dict(configuratie=self.configuratie),
        )

    @staticmethod
    @log_gebruikers_activiteit
    async def mutate(_root, _info, input, **_kwargs):
        previous = await hhb_dataloader().configuratie_by_id.load(input.id)

        response = requests.post(
            f"{settings.HHB_SERVICES_URL}/configuratie/{input.id}",
            json=input,
        )
        if not response.ok:
            raise GraphQLError(f"Upstream API responded: {response.text}")

        configuratie = response.json()["data"]

        return UpdateConfiguratie(ok=True, configuratie=configuratie, previous=previous)


class DeleteConfiguratie(graphene.Mutation):
    class Arguments:
        id = graphene.String(required=True)

    ok = graphene.Boolean()
    previous = graphene.Field(lambda: Configuratie)

    def gebruikers_activiteit(self, _root, info, id, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="configuratie", result=self, key="previous"
            ),
            before=dict(configuratie=self.previous),
        )

    @staticmethod
    @log_gebruikers_activiteit
    async def mutate(_root, _info, id):
        previous = await hhb_dataloader().configuratie_by_id.load(id)

        response = requests.delete(f"{settings.HHB_SERVICES_URL}/configuratie/{id}")
        if not response.ok:
            raise GraphQLError(f"Upstream API responded: {response.text}")

        return DeleteConfiguratie(ok=True, previous=previous)
