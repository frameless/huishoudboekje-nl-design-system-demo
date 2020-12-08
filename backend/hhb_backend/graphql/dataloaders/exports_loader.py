import requests
from graphql import GraphQLError

from hhb_backend.graphql.dataloaders.base_loader import SingleDataLoader


class ExportsByIdLoader(SingleDataLoader):
    """ Load exports using ids """
    model = "export"

    def get_by_timestamps(self, begin_timestamp, eind_timestamp):
        url = f"""{self.service}/{self.model}/?begin_timestamp={begin_timestamp}&eind_timestamp={eind_timestamp}"""

        response = requests.get(url)

        if not response.ok:
            raise GraphQLError(f"Upstream API responded: {response.text}")
        return response.json()["data"]

