import json

import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings


def get_rekening(rekening_id):
    rekeningen_response = requests.get(
        f"{settings.HHB_SERVICES_URL}/rekeningen/{rekening_id}",
        headers={'Content-type': 'application/json'}
    )
    if rekeningen_response.status_code != 200:
        raise GraphQLError(f"Upstream API responded: {rekeningen_response.json()}")
    return rekeningen_response.json()['data']


def create_gebruiker_rekening(gebruiker_id, rekening):
    return create_connected_rekening(gebruiker_id, 'gebruikers', rekening)


def create_organisatie_rekening(organisatie_id, rekening):
    return create_connected_rekening(organisatie_id, 'organisaties', rekening)


def create_connected_rekening(object_id, object_type, rekening):
    existing_rekening = get_rekening_by_iban(rekening['iban'])

    if existing_rekening:
        result = existing_rekening
    else:
        result = create_rekening(rekening)

    rekening_id = result["id"]
    rekening_response = requests.post(
        f"{settings.HHB_SERVICES_URL}/{object_type}/{object_id}/rekeningen/",
        data=json.dumps({"rekening_id": rekening_id}),
        headers={'Content-type': 'application/json'}
    )
    if rekening_response.status_code != 201:
        raise GraphQLError(f"Upstream API responded: {rekening_response.json()}")

    return result


def create_rekening(rekening):
    rekening_response = requests.post(
        f"{settings.HHB_SERVICES_URL}/rekeningen/",
        data=json.dumps(rekening),
        headers={'Content-type': 'application/json'}
    )
    if rekening_response.status_code != 201:
        raise GraphQLError(f"Upstream API responded: {rekening_response.json()}")
    return rekening_response.json()["data"]


def get_rekening_by_iban(iban):
    rekeningen = requests.get(
        f"{settings.HHB_SERVICES_URL}/rekeningen/",
        params={"filter_ibans": iban},
        headers={'Content-type': 'application/json'}
    )
    if rekeningen.status_code != 200:
        raise GraphQLError(f"Upstream API responded: {rekeningen.json()}")
    return next(iter(rekeningen.json()['data']), None)


def cleanup_rekening_when_orphaned(rekening_id):
    rekening_response = requests.get(f"{settings.HHB_SERVICES_URL}/rekeningen/{rekening_id}",
                                     headers={'Content-type': 'application/json'})
    if rekening_response == 200:
        rekening = rekening_response.json()['data']
        if not rekening['afspraken'] and not rekening['gebruikers'] and not rekening['organisaties']:
            requests.delete(f"{settings.HHB_SERVICES_URL}/rekeningen/{rekening_id}")
