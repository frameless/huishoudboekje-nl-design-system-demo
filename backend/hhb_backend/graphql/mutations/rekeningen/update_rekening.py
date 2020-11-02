""" GraphQL mutation for updating an existing Rekening """
import json

import graphene
import requests
from graphql import GraphQLError
from hhb_backend.graphql import settings
from hhb_backend.graphql.models.rekening import Rekening


class UpdateRekening(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        iban = graphene.String()
        rekeninghouder = graphene.String()

    ok = graphene.Boolean()
    rekening = graphene.Field(lambda: Rekening)

    def mutate(root, info, id, **kwargs):
        """ Update the rekening """
        response = requests.post(
            f"{settings.HHB_SERVICES_URL}/rekeningen/{id}",
            data=json.dumps(kwargs),
            headers={'Content-type': 'application/json'}
        )
        if response.status_code != 202:
            raise GraphQLError(f"Upstream API responded: {response.json()}")

        return UpdateRekening(rekening=response.json()["data"], ok=True)
