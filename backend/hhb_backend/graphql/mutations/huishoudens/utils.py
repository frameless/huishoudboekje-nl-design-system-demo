import json
from typing import Dict

import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings


def get_huishouden_by_id(id: int) -> Dict:
    huishouden = requests.get(
        f"{settings.HHB_SERVICES_URL}/huishoudens/",
        params={"filter_ids": id},
        headers={"Content-type": "application/json"},
    )
    if huishouden.status_code != 200:
        raise GraphQLError(f"Upstream API responded: {huishouden.text}")
    return next(iter(huishouden.json()["data"]), None)


def create_huishouden_if_not_exists(huishouden: Dict) -> Dict:
    existing_huishouden = get_huishouden_by_id(id=huishouden["id"])
    if existing_huishouden:
        return existing_huishouden
    else:
        resp = requests.post(
            f"{settings.HHB_SERVICES_URL}/huishoudens/",
            data=json.dumps(huishouden),
            headers={"Content-type": "application/json"},
        )
        if resp.status_code != 201:
            raise GraphQLError(f"Upstream API responded: {resp.text}")
        return resp.json()["data"]
