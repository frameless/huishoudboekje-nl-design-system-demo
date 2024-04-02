from typing import List

import requests
from hhb_backend.graphql.utils.upstream_error_handler import UpstreamError
from graphql import GraphQLError
from hhb_backend.graphql.dataloaders.base_loader import DataLoader
from hhb_backend.graphql.settings import HHB_SERVICES_URL
from hhb_backend.service.model.burger import Burger
from hhb_backend.graphql.settings import INTERNAL_CONNECTION_TIMEOUT, INTERNAL_READ_TIMEOUT


class BurgerLoader(DataLoader[Burger]):
    service = HHB_SERVICES_URL
    model = "burgers"

    def by_huishouden(self, huishouden_id: int) -> List[Burger]:
        return self.load(huishouden_id, filter_item="filter_huishoudens")
    
    def by_uuids(self, uuid: List[str]) -> List[Burger]:
        return self.load(uuid, filter_item="filter_uuid")

    def get_burger_search(self, search_value):
        try:
            url = f"{self.service}/{self.model}"
            params = {"search": True}
            body = {"search": search_value}
            response = requests.get(url, json=body, params=params, timeout=(INTERNAL_CONNECTION_TIMEOUT,INTERNAL_READ_TIMEOUT))

        except requests.exceptions.ReadTimeout:
            raise GraphQLError(f"Failed to read data from {self.service} in time ")
        except requests.exceptions.ConnectTimeout:
            raise GraphQLError(f"Failed to connect to {self.service} in time")
        except requests.exceptions.ConnectionError:
            raise GraphQLError(f"Failed to connect to service {self.service}")

        if response.status_code != 200:
            raise UpstreamError(response, f"Request to {url}  failed.")

        return response.json()["data"]
