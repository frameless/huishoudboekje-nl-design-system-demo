import json
from typing import Dict

import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader


async def create_huishouden_if_not_exists(huishouden: Dict) -> Dict:
    if "id" in huishouden:
        existing_huishoudens = hhb_dataloader().huishoudens_by_id.load(huishouden["id"]),
        # dataloader will always return a tuple with at least one value,
        # regardless of whether object is found or not (value is None otherwise)
        existing_huishouden = existing_huishoudens[0]
        if existing_huishouden:
            return existing_huishouden
        else:
            raise GraphQLError(f"Huishouden with id {huishouden['id']} not found")
    return create_new_huishouden(huishouden=huishouden)


def create_new_huishouden(huishouden: Dict = None):
    params = huishouden or {}
    resp = requests.post(
        f"{settings.HHB_SERVICES_URL}/huishoudens/",
        data=json.dumps(params),
        headers={"Content-type": "application/json"},
    )
    if resp.status_code != 201:
        raise GraphQLError(f"Upstream API responded: {resp.text}")
    return resp.json()["data"]

