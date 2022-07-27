import json
import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings

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
            raise GraphQLError(f"Connection error occurred on {self.service}")

        if not response.ok:
            raise GraphQLError(f"Response not ok: {response.json}")
        if response.status_code != 201:
            raise GraphQLError(f"Post to {self.model} not succeeded: {response.json}")

        return response.json()["data"]