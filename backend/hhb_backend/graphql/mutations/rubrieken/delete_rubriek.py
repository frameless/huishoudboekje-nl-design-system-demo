""" GraphQL mutation for deleting a Rubriek """
import os

import graphene
import requests
from graphql import GraphQLError
from hhb_backend.graphql import settings


class DeleteRubriek(graphene.Mutation):
    class Arguments:
        # gebruiker arguments
        id = graphene.Int(required=True)

    ok = graphene.Boolean()

    def mutate(root, info, id):
        """ Delete current rubriek """
        delete_response = requests.delete(f"{settings.HHB_SERVICES_URL}/rubrieken/{id}")
        if delete_response.status_code != 204:
            raise GraphQLError(f"Upstream API responded: {delete_response.json()}")
        return DeleteRubriek(ok=True)
