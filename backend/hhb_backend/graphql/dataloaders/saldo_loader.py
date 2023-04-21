import logging
from typing import List
from hhb_backend.graphql.dataloaders.base_loader import DataLoader
from hhb_backend.graphql.settings import HHB_SERVICES_URL
from hhb_backend.service.model.saldo import Saldo
import requests
from graphql import GraphQLError
from hhb_backend.graphql.utils.upstream_error_handler import UpstreamError


class SaldoLoader(DataLoader[Saldo]):
    service = HHB_SERVICES_URL
    model = "saldo"

    def get_saldo(self, burger_ids: List[int], date: str):
        try:
            url = f"{self.service}/{self.model}"
            params = {"date": date}
            body = {"burger_ids": burger_ids}
            response = requests.get(url, json=body, params=params)

        except requests.exceptions.ConnectionError:
            raise GraphQLError(f"Failed to connect to service {self.service}")

        if response.status_code != 200:
            raise UpstreamError(response, f"Request to {url}  failed.")

        return response.json()["data"]

    def get_saldo_range(self, burger_ids: List[int], startdate: str, enddate: str):
        try:
            url = f"{self.service}/{self.model}"
            params = {"startdate": startdate, "enddate": enddate}
            body = {"burger_ids": burger_ids}
            response = requests.get(url, json=body, params=params)

        except requests.exceptions.ConnectionError:
            raise GraphQLError(f"Failed to connect to service {self.service}")

        if response.status_code != 200:
            raise UpstreamError(response, f"Request to {url}  failed.")

        return response.json()["data"]

    def get_saldos(self, burger_ids: List[int]):
        try:
            url = f"{self.service}/{self.model}"
            params = {}
            body = {"burger_ids": burger_ids}
            response = requests.get(url, json=body, params=params)

        except requests.exceptions.ConnectionError:
            raise GraphQLError(f"Failed to connect to service {self.service}")

        if response.status_code != 200:
            raise UpstreamError(response, f"Request to {url}  failed.")

        return response.json()["data"]

    def get_closest_saldo(self, burger_ids: List[int], date):
        try:
            url = f"{self.service}/{self.model}"
            params = {"closest_to": date}
            body = {"burger_ids": burger_ids}
            response = requests.get(url, json=body, params=params)

        except requests.exceptions.ConnectionError:
            raise GraphQLError(f"Failed to connect to service {self.service}")

        if response.status_code != 200:
            raise UpstreamError(response, f"Request to {url}  failed.")

        return response.json()["data"]
