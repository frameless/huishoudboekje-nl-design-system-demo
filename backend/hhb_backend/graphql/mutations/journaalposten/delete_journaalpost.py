import graphene
import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings


class DeleteJournaalpost(graphene.Mutation):
    """ Delete journaalpost by id """
    class Arguments:
        id = graphene.Int(required=True)

    ok = graphene.Boolean()

    def mutate(root, info, id):
        response = requests.delete(f"{settings.HHB_SERVICES_URL}/journaalposten/{id}")
        if not response.ok:
            raise GraphQLError(f"Upstream API responded: {response.text}")
        return DeleteJournaalpost(ok=True)
