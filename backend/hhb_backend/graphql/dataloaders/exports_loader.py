import requests
from graphql import GraphQLError

from hhb_backend.graphql.dataloaders.base_loader import SingleDataLoader


class ExportsByIdLoader(SingleDataLoader):
    """ Load exports using ids """
    model = "export"

    def get_by_timestamps(self, start_datum, eind_datum):
        url = f"""{self.service}/{self.model}/?start_datum={start_datum}&eind_datum={eind_datum}"""

        response = requests.get(url)

        if not response.ok:
            raise GraphQLError(f"Upstream API responded: {response.text}")
        return response.json()["data"]

