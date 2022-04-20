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


def get_afdeling(afdeling_id):
    afdeling_response = requests.get(
        f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/{afdeling_id}",
        headers={"Content-type": "application/json"}
    )
    if afdeling_response.status_code != 200:
        raise GraphQLError(f"Upstream API responded: {afdeling_response.json()}")
    return afdeling_response.json()['data']


def update_afdeling(afdeling_id, afdeling_input):
    update_afdeling_response = requests.post(
        f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/{afdeling_id}",
        json=afdeling_input,
        headers={"Content-type": "application/json"},
    )
    if update_afdeling_response.status_code != 200:
        raise GraphQLError(
            f"Upstream API responded: {update_afdeling_response.json()}"
        )

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

    # rekening_id toevoegen aan afdeling
    if object_type == "afdelingen":
        previous_afdeling = get_afdeling(object_id)

        if previous_afdeling.get("rekeningen_ids"):
            rekeningen_ids = list(previous_afdeling["rekeningen_ids"])
        else:
            rekeningen_ids = list()

        rekeningen_ids.append(rekening_id)

        afdeling_input = {
            **previous_afdeling,
            "rekeningen_ids": rekeningen_ids
        }

        update_afdeling(object_id, afdeling_input)

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

def cleanup_rekening_when_orphaned(rekening_id: int):
    used_by = rekening_used_check(rekening_id)
    if len(used_by) == 0:
        delete_rekening(rekening_id)

def disconnect_afdeling_rekening(afdeling_id: int, rekening_id: int):
    # remove rekening reference from afdeling
    afdeling_rekening_resp = requests.delete(
        f"{settings.HHB_SERVICES_URL}/afdelingen/{afdeling_id}/rekeningen",
        json={"rekening_id": rekening_id},
        headers={"Content-type": "application/json"},
    )
    if afdeling_rekening_resp.status_code != 202:
        raise GraphQLError(f"Failure to disconnect afdeling:{afdeling_id} rekening:{rekening_id}")

    # Delete the Id from rekeningen_ids column in afdeling
    previous_afdeling = requests.get(
            f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/{afdeling_id}",
            headers={"Content-type": "application/json"}
        ).json()['data']
    previous_afdeling["rekeningen_ids"].remove(rekening_id)
    previous_afdeling.pop("id")

    # Try update of organisatie service
    update_afdeling(afdeling_id, previous_afdeling)

def disconnect_burger_rekening(burger_id: int, rekening_id: int):
    # remove rekening reference from burger
    burger_rekening_resp = requests.delete(
        f"{settings.HHB_SERVICES_URL}/burgers/{burger_id}/rekeningen",
        json={"rekening_id": rekening_id},
        headers={"Content-type": "application/json"},
    )
    if burger_rekening_resp.status_code != 202:
        raise GraphQLError(f"Failure to disconnect burger:{burger_id} rekening:{rekening_id}")

def delete_rekening(rekening_id: int):
    rekening_delete_response = requests.delete(f"{settings.HHB_SERVICES_URL}/rekeningen/{rekening_id}")
    if rekening_delete_response.status_code != 204:
        raise GraphQLError(f"Failure to delete rekening:{rekening_id}")

def delete_afdeling(afdeling_id: int):
    afdeling_delete_response = requests.delete(f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/{afdeling_id}")
    if afdeling_delete_response.status_code != 204:
        raise GraphQLError(f"Failure to delete afdeling:{afdeling_id}")
    

def rekening_used_check(rekening_id):
    rekening_response = requests.get(
        f"{settings.HHB_SERVICES_URL}/rekeningen/{rekening_id}",
        headers={"Content-type": "application/json"},
    )

    if rekening_response.status_code == 200:
        rekening = rekening_response.json()["data"]
        used = {}
        afspraken = rekening.get("afspraken")
        if afspraken:
            used.update({"afspraken" : afspraken})
        burgers = rekening.get("burgers")
        if burgers:
            used.update({"burgers" : burgers})
        afdelingen = rekening.get("afdelingen")
        if afdelingen:
            used.update({"afdelingen" : afdelingen})

        return used
    else:
        raise GraphQLError(f"Upstream API responded: {rekening_response.text}")
            
