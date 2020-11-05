""" GraphQL mutation for deleting a Rekening from a Gebruiker """
import json

import graphene
import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.mutations.rekeningen.utils import cleanup_rekening_when_orphaned


class DeleteGebruikerRekening(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        gebruiker_id = graphene.Int(required=True)

    ok = graphene.Boolean()

    def mutate(root, info, id, **kwargs):
        """ Delete rekening assocations with either gebruiker or organisation """
        gebruiker_id = kwargs.pop("gebruiker_id")

        delete_response = requests.delete(f"{settings.HHB_SERVICES_URL}/gebruikers/{gebruiker_id}/rekeningen/",
                                          data=json.dumps({"rekening_id": id}),
                                          headers={'Content-type': 'application/json'})
        if delete_response.status_code != 202:
            raise GraphQLError(f"Upstream API responded: {delete_response.json()}")

        cleanup_rekening_when_orphaned(id)

        return DeleteGebruikerRekening(ok=True)
