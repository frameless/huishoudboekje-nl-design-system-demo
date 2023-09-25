from typing import List
from hhb_backend.graphql.dataloaders.base_loader import DataLoader
from hhb_backend.graphql.settings import ORGANISATIE_SERVICES_URL
from hhb_backend.service.model.organisatie import Organisatie
import requests
from graphql import GraphQLError
from hhb_backend.graphql.utils.upstream_error_handler import UpstreamError
from hhb_backend.graphql.settings import INTERNAL_CONNECTION_TIMEOUT, INTERNAL_READ_TIMEOUT


class OrganisatieLoader(DataLoader[Organisatie]):
    service = ORGANISATIE_SERVICES_URL
    model = "organisaties"

    
    def organisatie_afdelingen_by_rekening_ids(self, rekeningen_ids: List[int]):
        try:
            url = f"{self.service}/{self.model}/rekeningen"
            body = {"rekeningen_ids": rekeningen_ids}
            response = requests.get(url, json=body, timeout=(INTERNAL_CONNECTION_TIMEOUT,INTERNAL_READ_TIMEOUT))

        except requests.exceptions.ReadTimeout:
            raise GraphQLError(f"Failed to read data from {self.service} in time ")
        except requests.exceptions.ConnectTimeout:
            raise GraphQLError(f"Failed to connect to {self.service} in time")
        except requests.exceptions.ConnectionError:
            raise GraphQLError(f"Failed to connect to service {self.service}")

        if response.status_code != 200:
            raise UpstreamError(response, f"Request to {url}  failed.")
        
        return response.json()["data"]