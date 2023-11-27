
import requests
from hhb_backend.graphql.settings import RAPPORTAGE_SERVICE_URL
from graphql import GraphQLError
from hhb_backend.graphql.utils.upstream_error_handler import UpstreamError
from hhb_backend.graphql.settings import INTERNAL_CONNECTION_TIMEOUT, INTERNAL_READ_TIMEOUT


class OverzichtLoader():
    service = RAPPORTAGE_SERVICE_URL
    model = "overzicht"

    def load_huishouden_overzicht(self, burger_ids, start_date, end_date):
        try:
            body = {
                "burger_ids": burger_ids,
            }
            url = f"{self.service}/{self.model}"
            params = {"startDate": start_date, "endDate": end_date}
            response = requests.get(url, params=params, json=body, timeout=(
                INTERNAL_CONNECTION_TIMEOUT, INTERNAL_READ_TIMEOUT))

        except requests.exceptions.ReadTimeout:
            raise GraphQLError(
                f"Failed to read data from {self.service} in time ")
        except requests.exceptions.ConnectTimeout:
            raise GraphQLError(f"Failed to connect to {self.service} in time")
        except requests.exceptions.ConnectionError:
            raise GraphQLError(f"Failed to connect to service {self.service}")

        if response.status_code == 204 or response.status_code == 400:
            return None

        if response.status_code == 500:
            raise UpstreamError(response, f"Request to {url} {params} failed.")

        return response.json()["data"]
