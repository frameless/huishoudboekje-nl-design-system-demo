from typing import List
from hhb_backend.graphql.dataloaders.base_loader import DataLoader
from hhb_backend.graphql.settings import RAPPORTAGE_SERVICE_URL
from hhb_backend.service.model.saldo import Saldo
import requests
from graphql import GraphQLError
from hhb_backend.graphql.utils.upstream_error_handler import UpstreamError
from hhb_backend.graphql.settings import INTERNAL_CONNECTION_TIMEOUT, INTERNAL_READ_TIMEOUT


class SaldoLoader(DataLoader[Saldo]):
    service = RAPPORTAGE_SERVICE_URL
    model = "saldo"

    def get_saldo(self, burger_ids: List[int], date: str):
        try:
            url = f"{self.service}/{self.model}"
            params = {"date": date}
            body = {"burger_ids": burger_ids}
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

