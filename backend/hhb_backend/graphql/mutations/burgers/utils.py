import json
from typing import Dict

import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings


async def get_burger_by_id(id: int) -> Dict:
    burger = requests.get(
        f"{settings.HHB_SERVICES_URL}/burgers/",
        params={"filter_ids": id},
        headers={"Content-type": "application/json"},
    )
    if burger.status_code != 200:
        raise GraphQLError(f"Upstream API responded: {burger.text}")
    return next(iter(burger.json()["data"]), None)


async def update_existing_burger(burger: Dict):
    resp = requests.post(
        f"{settings.HHB_SERVICES_URL}/burgers/{burger['id']}", json=burger
    )
    if resp.status_code != 200:
        raise GraphQLError(f"Upstream API responded: {resp.text}")
    return resp.json()["data"]


async def get_burgers_by_huishouden_id(huishouden_id: int):
    params = {
        "filters": json.dumps({
            "huishouden_id": huishouden_id
        })
    }
    burgers_resp = requests.get(
        f"{settings.HHB_SERVICES_URL}/burgers/",
        params=params,
        headers={"Content-type": "application/json"},
    )
    if burgers_resp.status_code != 200:
        raise GraphQLError(f"Upstream API responded: {burgers_resp.text}")
    return burgers_resp.json()["data"]
