""" GraphQL mutation for deleting a Rekening """
import json
import os

import graphene
import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings


class DeleteRekening(graphene.Mutation):
    class Arguments:
        # rekening id
        id = graphene.Int(required=True)
        gebruiker_id = graphene.Int()
        organisatie_id = graphene.Int()

    ok = graphene.Boolean()

    def mutate(root, info, id, **kwargs):
        """ Delete rekening assocations with either gebruiker or organisation """
        gebruiker_id = None
        organisatie_id = None
        if "gebruiker_id" in kwargs:
            gebruiker_id = kwargs.pop("gebruiker_id")
        if "organisatie_id" in kwargs:
            organisatie_id = kwargs.pop("organisatie_id")

        if (gebruiker_id is None and organisatie_id is None) or (
                gebruiker_id is not None and organisatie_id is not None):
            raise GraphQLError(f"Either gebruiker_id or organisatie_id has to be filled in.")

        if gebruiker_id is not None:
            url = f"{settings.HHB_SERVICES_URL}/gebruikers/{gebruiker_id}/rekeningen/"
        else:
            url = f"{settings.HHB_SERVICES_URL}/organisaties/{organisatie_id}/rekeningen/"

        delete_response = requests.delete(url, data=json.dumps({"rekening_id": id}),
                                          headers={'Content-type': 'application/json'})

        if delete_response.status_code != 202:
            raise GraphQLError(f"Upstream API responded: {delete_response.json()}")

        return DeleteRekening(ok=True)
