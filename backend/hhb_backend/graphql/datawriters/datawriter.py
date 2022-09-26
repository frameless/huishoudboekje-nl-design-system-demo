import json
import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.utils.upstream_error_handler import UpstreamError

class DataWriter:
    model = None
    service = settings.HHB_SERVICES_URL

    def post(self, input):
        try:
            response = requests.post(f"{self.service}/{self.model}", 
                        data=json.dumps(input),
                        headers={"Content-type": "application/json"},
                       )
        except requests.exceptions.ConnectionError:
            raise GraphQLError(f"Failed to connect to service {self.service}")

        if response.status_code != 201:
            raise UpstreamError(response, f"Could not POST to {self.model}. [{response.status_code}] {response.text}")

        return response.json()["data"]

    # TODO
    # def put(self, input):
    #     return response.json()["data"]

    # TODO
    # def delete(self, input)