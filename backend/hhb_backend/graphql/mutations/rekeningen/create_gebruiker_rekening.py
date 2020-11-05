""" GraphQL mutation for creating a new Rekening """

import graphene
from graphql import GraphQLError
import requests
from hhb_backend.graphql import settings
import json

import hhb_backend.graphql.models.rekening as rekening
import hhb_backend.graphql.mutations.rekening_input as rekening_input


class CreateGebruikerRekening(graphene.Mutation):
    class Arguments:
        gebruiker_id = graphene.Int(required=True)
        rekening = graphene.Argument(lambda: rekening_input.RekeningInput, required=True)

    ok = graphene.Boolean()
    rekening = graphene.Field(rekening.Rekening)

    @staticmethod
    def mutate(root, info, **kwargs):
        """ Create the new Rekening """
        gebruiker_id = kwargs.pop('gebruiker_id')
        rekening = kwargs.pop('rekening')

        result = create_gebruiker_rekening(gebruiker_id, rekening)
        return CreateGebruikerRekening(rekening=result, ok=True)

def create_gebruiker_rekening(gebruiker_id, rekening):
    existing_rekeningen_response = requests.get(
        f"{settings.HHB_SERVICES_URL}/rekeningen/",
        params={"filter_ibans": rekening['iban']},
        headers={'Content-type': 'application/json'}
    )
    if existing_rekeningen_response.status_code != 200:
        raise GraphQLError(f"Upstream API responded: {existing_rekeningen_response.json()}")
    existing_rekening = next(iter(existing_rekeningen_response.json()['data']), None)

    if existing_rekening:
        result = existing_rekening
    else:
        rekening_response = requests.post(
            f"{settings.HHB_SERVICES_URL}/rekeningen/",
            data=json.dumps(rekening),
            headers={'Content-type': 'application/json'}
        )
        if rekening_response.status_code != 201:
            raise GraphQLError(f"Upstream API responded: {rekening_response.json()}")
        result = rekening_response.json()["data"]

    rekening_id = result["id"]
    gebruiker_rekening_response = requests.post(
        f"{settings.HHB_SERVICES_URL}/gebruikers/{gebruiker_id}/rekeningen/",
        data=json.dumps({"rekening_id": rekening_id}),
        headers={'Content-type': 'application/json'}
    )
    if gebruiker_rekening_response.status_code != 201:
        raise GraphQLError(f"Upstream API responded: {gebruiker_rekening_response.json()}")

    return result


def get_rekening(id):
    rekeningen_response = requests.get(
        f"{settings.HHB_SERVICES_URL}/rekeningen/{id}",
        headers={'Content-type': 'application/json'}
    )
    if rekeningen_response.status_code != 200:
        raise GraphQLError(f"Upstream API responded: {rekeningen_response.json()}")
    return next(iter(rekeningen_response.json()['data']), None)
