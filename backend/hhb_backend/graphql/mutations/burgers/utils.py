from typing import Dict

import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings


async def update_existing_burger(burger: Dict):
    resp = requests.post(
        f"{settings.HHB_SERVICES_URL}/burgers/{burger['id']}", json=burger
    )
    if resp.status_code != 200:
        raise GraphQLError(f"Upstream API responded: {resp.text}")
    return resp.json()["data"]
