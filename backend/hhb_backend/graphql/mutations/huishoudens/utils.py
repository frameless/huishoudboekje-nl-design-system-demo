import json
from typing import Dict

import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.service.model.huishouden import Huishouden


def create_huishouden_if_not_exists(huishouden: Dict) -> Huishouden:
    if huishouden and "id" in huishouden:
        existing_huishouden = hhb_dataloader().huishoudens.load_one(huishouden["id"])
        # dataloader will always return a tuple with at least one value,
        # regardless of whether object is found or not (value is None otherwise)
        if existing_huishouden:
            return existing_huishouden
        else:
            raise GraphQLError(f"Huishouden with id {huishouden['id']} not found")
    return create_new_huishouden(huishouden=huishouden)


def create_new_huishouden(huishouden: Dict = None) -> Huishouden:
    params = huishouden or {}
    resp = requests.post(
        f"{settings.HHB_SERVICES_URL}/huishoudens/",
        data=json.dumps(params),
        headers={"Content-type": "application/json"},
    )
    if resp.status_code != 201:
        raise GraphQLError(f"Upstream API responded: {resp.text}")
    return Huishouden(resp.json()["data"])

