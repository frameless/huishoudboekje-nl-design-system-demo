
import requests
from hhb_backend.graphql.settings import RAPPORTAGE_SERVICE_URL
from graphql import GraphQLError
from hhb_backend.graphql.utils.upstream_error_handler import UpstreamError

class RapportageLoader():
    service = RAPPORTAGE_SERVICE_URL
    model = "rapportage"

    def load_rapportage_burger(self, burger_id, start_date, end_date):
        try:
            url = f"{self.service}/{self.model}/{burger_id}"
            params = {"startDate": start_date, "endDate": end_date}
            response = requests.get(url, params=params)

        except requests.exceptions.ConnectionError:
            raise GraphQLError(f"Failed to connect to service {self.service}")

        if response.status_code != 200:
            raise UpstreamError(response, f"Request to {url} {params} failed.")
        
        return response.json()["data"]
