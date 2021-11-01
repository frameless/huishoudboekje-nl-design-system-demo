import json

import requests
from graphql import GraphQLError
from schwifty import IBAN
from schwifty.exceptions import SchwiftyException

from hhb_backend.graphql import settings

def get_rekening(rekening_id):
    rekeningen_response = requests.get(
        f"{settings.HHB_SERVICES_URL}/rekeningen/{rekening_id}",
        headers={"Content-type": "application/json"},
    )
    if rekeningen_response.status_code != 200:
        raise GraphQLError(f"Upstream API responded: {rekeningen_response.json()}")
    return rekeningen_response.json()["data"]


def create_burger_rekening(burger_id, rekening):
    return create_connected_rekening(burger_id, "burgers", rekening)


def create_afdeling_rekening(afdeling_id, rekening):
    return create_connected_rekening(afdeling_id, "afdelingen", rekening)


def create_connected_rekening(object_id, object_type, rekening):
    existing_rekening = get_rekening_by_iban(rekening["iban"])

    if existing_rekening:
        result = existing_rekening
    else:
        result = create_rekening(rekening)

    rekening_id = result["id"]
    rekening_response = requests.post(
        f"{settings.HHB_SERVICES_URL}/{object_type}/{object_id}/rekeningen/",
        data=json.dumps({"rekening_id": rekening_id}),
        headers={"Content-type": "application/json"},
    )
    if rekening_response.status_code != 201:
        raise GraphQLError(f"Upstream API responded: {rekening_response.text}")

    return result


def create_rekening(rekening):
    try:
        iban = IBAN(rekening.iban)
        rekening.iban = iban.compact
    except SchwiftyException as error:
        raise GraphQLError(f"Foutieve IBAN: {rekening.iban}")

    rekening_response = requests.post(
        f"{settings.HHB_SERVICES_URL}/rekeningen/",
        data=json.dumps(rekening),
        headers={"Content-type": "application/json"},
    )
    if rekening_response.status_code != 201:
        raise GraphQLError(f"Upstream API responded: {rekening_response.text}")
    return rekening_response.json()["data"]


def get_rekening_by_iban(iban):
    rekeningen = requests.get(
        f"{settings.HHB_SERVICES_URL}/rekeningen/",
        params={"filter_ibans": iban},
        headers={"Content-type": "application/json"},
    )
    if rekeningen.status_code != 200:
        raise GraphQLError(f"Upstream API responded: {rekeningen.text}")
    return next(iter(rekeningen.json()["data"]), None)

def cleanup_rekening_when_orphaned(rekening_id):
    used_by = rekening_used_check(rekening_id)
    if len(used_by) == 0:
        requests.delete(f"{settings.HHB_SERVICES_URL}/rekeningen/{rekening_id}")

def rekening_used_check(rekening_id):
    rekening_response = requests.get(
        f"{settings.HHB_SERVICES_URL}/rekeningen/{rekening_id}",
        headers={"Content-type": "application/json"},
    )

    used = []
    if rekening_response.status_code == 200:
        rekening = rekening_response.json()["data"]
        if rekening.get("afspraken", None):
            used.append("afspraken")
        if rekening.get("burgers", None):
            used.append("burgers")
        if rekening.get("afdelingen", None):
            used.append("afdelingen")
    else:
        raise GraphQLError(f"Upstream API responded: {rekeningen.text}")
            
    return used
