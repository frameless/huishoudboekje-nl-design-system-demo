""" GraphQL mutation for deleting a Rekening """
import json
import os

import graphene
import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings


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

        rekening_response = requests.get(f"{settings.HHB_SERVICES_URL}/rekeningen/{id}", headers={'Content-type': 'application/json'})
        if rekening_response == 200:
            rekening = rekening_response.json()['data']
            if not rekening['afspraken'] and not rekening['gebruikers'] and not rekening['organisaties']:
                requests.delete(f"{settings.HHB_SERVICES_URL}/rekeningen/{id}")

        return DeleteGebruikerRekening(ok=True)
