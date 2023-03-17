from typing import List
from hhb_backend.graphql.dataloaders.base_loader import DataLoader
from hhb_backend.graphql.settings import ORGANISATIE_SERVICES_URL
from hhb_backend.service.model.organisatie import Organisatie
import requests
from graphql import GraphQLError
from hhb_backend.graphql.utils.upstream_error_handler import UpstreamError


class OrganisatieLoader(DataLoader[Organisatie]):
    service = ORGANISATIE_SERVICES_URL
    model = "organisaties"

    
    def organisatie_rekeningen_by_rekening_id(self, rekening_id: int) -> List[int]:
        try:
            url = f"{self.service}/rekeningen/{rekening_id}/organisatie/rekeningen"
            response = requests.get(url)

        except requests.exceptions.ConnectionError:
            raise GraphQLError(f"Failed to connect to service {self.service}")

        if response.status_code != 200:
            raise UpstreamError(response, f"Request to {url}  failed.")
        
        return response.json()["data"]