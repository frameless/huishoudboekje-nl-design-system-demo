""" GraphQL mutation for deleting a Gebruiker/Burger """
import os
import json
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
        """ Delete current gebruiker

        force:  if set to true the gebruiker reccord will be deleted,
                otherwise only the burger is deleted
                and the gebruikers fields are cleared
        """

        delete_response = requests.delete(
            os.path.join(settings.HHB_SERVICES_URL, f"gebruikers/{id}")
        )
        if delete_response.status_code != 204:
            raise GraphQLError(f"Upstream API responded: {delete_response.json()}")
        return DeleteGebruiker(ok=True)

