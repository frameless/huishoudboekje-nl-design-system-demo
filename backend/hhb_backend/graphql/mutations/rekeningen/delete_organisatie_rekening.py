""" GraphQL mutation for deleting a Rekening from an Organisatie """
import json

import graphene
import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.mutations.rekeningen.utils import cleanup_rekening_when_orphaned


class DeleteOrganisatieRekening(graphene.Mutation):
    class Arguments:
        rekening_id = graphene.Int(required=True)
        organisatie_id = graphene.Int(required=True)

    ok = graphene.Boolean()

    def mutate(root, info, **kwargs):
        """ Delete rekening assocations with an organisatie """
        rekening_id = kwargs.pop('rekening_id')
        organisatie_id = kwargs.pop('organisatie_id')

        delete_response = requests.delete(f"{settings.HHB_SERVICES_URL}/organisaties/{organisatie_id}/rekeningen/",
                                          data=json.dumps({"rekening_id": rekening_id}),
                                          headers={'Content-type': 'application/json'})
        if delete_response.status_code != 202:
            raise GraphQLError(f"Upstream API responded: {delete_response.json()}")

        cleanup_rekening_when_orphaned(rekening_id)

        return DeleteOrganisatieRekening(ok=True)


