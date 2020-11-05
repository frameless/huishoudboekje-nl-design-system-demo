""" GraphQL mutation for updating an existing Rekening """
import json

import graphene
import requests
from graphql import GraphQLError
from hhb_backend.graphql import settings

import hhb_backend.graphql.models.rekening as rekening
import hhb_backend.graphql.mutations.rekeningen.rekening_input as rekening_input


class UpdateRekening(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        rekening = graphene.Argument(lambda: rekening_input.RekeningInput, required=True)

    ok = graphene.Boolean()
    rekening = graphene.List(rekening.Rekening)

    @staticmethod
    def mutate(root, info, **kwargs):
        """ Create the new Rekening """
        id = kwargs.pop('id')
        rekening = kwargs.pop('rekening')

        existing_rekeningen_response = requests.get(
            f"{settings.HHB_SERVICES_URL}/rekeningen/{id}",
            headers={'Content-type': 'application/json'}
        )
        if existing_rekeningen_response.status_code != 200:
            raise GraphQLError(f"Upstream API responded: {existing_rekeningen_response.json()}")
        existing_rekening = next(existing_rekeningen_response.json()['data'], None)

        if existing_rekening is None:
            raise GraphQLError(f"Rekening does not exist")

        if existing_rekening['iban'] != rekening["iban"]:
            raise GraphQLError(f"Rekening has different iban")

        response = requests.post(
            f"{settings.HHB_SERVICES_URL}/rekeningen/{id}",
            data=json.dumps(rekening),
            headers={'Content-type': 'application/json'}
        )
        if response.status_code != 200:
            raise GraphQLError(f"Upstream API responded: {response.json()}")

        return UpdateRekening(ok=True, rekening=response.json()["data"])
