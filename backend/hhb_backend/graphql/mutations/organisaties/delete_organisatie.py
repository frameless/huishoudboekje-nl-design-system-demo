""" GraphQL mutation for deleting a Organisatie """
import os
import json
import graphene
import requests
from graphql import GraphQLError
from hhb_backend.graphql import settings

class DeleteOrganisatie(graphene.Mutation):
    class Arguments:
        # organisatie arguments
        id = graphene.Int(required=True)

    ok = graphene.Boolean()

    def mutate(root, info, id):
        """ Delete current organisatie """
        kvk_nummer_response = requests.get(
            f"{settings.HHB_SERVICES_URL}/organisaties/{id}"
        )
        if kvk_nummer_response.status_code != 200:
            raise GraphQLError(f"Upstream API responded: {kvk_nummer_response.json()}")
        kvk_nummer = kvk_nummer_response.json()["data"]["kvk_nummer"]

        delete_response_hhb = requests.delete(
            os.path.join(settings.HHB_SERVICES_URL, f"organisaties/{id}")
        )
        if delete_response_hhb.status_code != 204:
            raise GraphQLError(f"Upstream API responded: {delete_response_hhb.json()}")

        delete_response_org = requests.delete(
            os.path.join(settings.ORGANISATIE_SERVICES_URL, f"organisaties/{kvk_nummer}")
        )
        if delete_response_org.status_code not in [204, 404]:
            raise GraphQLError(f"Upstream API responded: {delete_response_hhb.json()}")
        return DeleteOrganisatie(ok=True)

