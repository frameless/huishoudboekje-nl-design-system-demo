import json
import logging
import requests
from graphql import GraphQLError
from schwifty import IBAN
from schwifty.exceptions import SchwiftyException

from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader


def get_afdeling(afdeling_id):
    return hhb_dataloader().afdelingen.load_one(afdeling_id)


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

    result = existing_rekening if existing_rekening else create_rekening(rekening)

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

        rekeningen_ids = previous_afdeling.rekeningen_ids
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
    except SchwiftyException:
        raise GraphQLError(f"Invalid IBAN: {rekening.iban}")

    rekening_response = requests.post(
        f"{settings.HHB_SERVICES_URL}/rekeningen/",
        data=json.dumps(rekening),
        headers={"Content-type": "application/json"},
    )
    if rekening_response.status_code != 201:
        raise GraphQLError(f"Upstream API responded: {rekening_response.text}")
    return rekening_response.json()["data"]


def get_rekening_by_iban(iban):
    return hhb_dataloader().rekeningen.by_iban(iban)


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
    previous_afdeling = hhb_dataloader().afdelingen.load_one(afdeling_id)
    previous_afdeling.rekeningen_ids.remove(rekening_id)
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
    

def rekening_used_check(rekening_id) -> (list, list, list):
    rekening = hhb_dataloader().rekeningen.load_one(rekening_id)
    return rekening.afdelingen or [], rekening.afspraken or [], rekening.burgers or []
