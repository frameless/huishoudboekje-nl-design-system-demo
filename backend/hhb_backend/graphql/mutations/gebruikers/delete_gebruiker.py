""" GraphQL mutation for deleting a Gebruiker/Burger """
import os

import graphene
import requests
from graphql import GraphQLError
from hhb_backend.graphql import settings


class DeleteGebruiker(graphene.Mutation):
    class Arguments:
        # gebruiker arguments
        id = graphene.Int(required=True)

    ok = graphene.Boolean()

    def mutate(root, info, id):
        """ Delete current gebruiker """

        delete_response = requests.delete(f"{settings.HHB_SERVICES_URL}/gebruikers/{id}")
        if delete_response.status_code != 202:
            raise GraphQLError(f"Upstream API responded: {delete_response.json()}")
        return DeleteGebruiker(ok=True)
