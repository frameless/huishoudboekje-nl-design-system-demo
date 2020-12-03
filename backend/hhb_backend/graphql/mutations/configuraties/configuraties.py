import graphene
import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.models.configuratie import Configuratie


class ConfiguratieInput(graphene.InputObjectType):
    id = graphene.String(required=True)
    waarde = graphene.String()


class CreateConfiguratie(graphene.Mutation):
    class Arguments:
        input = graphene.Argument(ConfiguratieInput)

    ok = graphene.Boolean()
    configuratie = graphene.Field(lambda: Configuratie)

    def mutate(root, info, input, **kwargs):
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

    def mutate(root, info, input, **kwargs):
        post_response = requests.post(
            f"{settings.HHB_SERVICES_URL}/configuratie/{input.id}",
            json=input,
        )
        if not post_response.ok:
            raise GraphQLError(f"Upstream API responded: {post_response.text}")

        return UpdateConfiguratie(configuratie=post_response.json()["data"], ok=True)


class DeleteConfiguratie(graphene.Mutation):
    class Arguments:
        id = graphene.String(required=True)

    ok = graphene.Boolean()

    def mutate(root, info, id, **kwargs):
        response = requests.delete(f"{settings.HHB_SERVICES_URL}/configuratie/{id}")
        if not response.ok:
            raise GraphQLError(f"Upstream API responded: {response.text}")

        return DeleteConfiguratie(ok=True)
