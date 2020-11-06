""" GraphQL mutation for deleting a Organisatie """
import os
import graphene
import requests
from graphql import GraphQLError
from hhb_backend.graphql import settings

class DeleteCustomerStatementMessage(graphene.Mutation):
    class Arguments:
        # organisatie arguments
        id = graphene.Int(required=True)

    ok = graphene.Boolean()

    def mutate(root, info, id):
        """ Delete current Customer Statement Message """

        delete_response_hhb = requests.delete(
            f"{settings.TRANSACTIE_SERVICES_URL}/customerstatementmessages/{id}"
        )
        if delete_response_hhb.status_code != 204:
            raise GraphQLError(f"Upstream API responded: {delete_response_hhb.json()}")

        return DeleteCustomerStatementMessage(ok=True)

