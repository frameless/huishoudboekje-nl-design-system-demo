from datetime import date
import logging
from typing import List

from graphql import GraphQLError
from hhb_backend.graphql.dataloaders.base_loader import DataLoader
from hhb_backend.graphql.settings import HHB_SERVICES_URL, INTERNAL_CONNECTION_TIMEOUT, INTERNAL_READ_TIMEOUT
from hhb_backend.graphql.utils.upstream_error_handler import UpstreamError
from hhb_backend.service.model.export import Export
import requests


class ExportLoader(DataLoader[Export]):
    service = HHB_SERVICES_URL
    model = "export"

    def in_date_range(self, start_datum: str, eind_datum: str) -> List[dict]:
        return self.load_all(params={
            'start_datum': start_datum,
            'eind_datum': eind_datum
        })
    
    

    def custom_paged(self, offset: str, limit: str) -> List[dict]:
        try:
            url = f"{self.service}/{self.model}/paged"
            params = {
                "offset": offset,
                "limit": limit
            }
            response = requests.get(url, json={}, params=params, timeout=(INTERNAL_CONNECTION_TIMEOUT,INTERNAL_READ_TIMEOUT))

        except requests.exceptions.ReadTimeout:
            raise GraphQLError(f"Failed to read data from {self.service} in time ")
        except requests.exceptions.ConnectTimeout:
            raise GraphQLError(f"Failed to connect to {self.service} in time")
        except requests.exceptions.ConnectionError:
            raise GraphQLError(f"Failed to connect to service {self.service}")

        if response.status_code != 200:
            raise UpstreamError(response, f"Request to {url}  failed.")
        
        return response.json()
