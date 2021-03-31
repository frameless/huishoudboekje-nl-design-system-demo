import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders.base_loader import SingleDataLoader


class GebruikersActiviteitenByIdLoader(SingleDataLoader):
    """ Load gebruikersactiviteiten using ids """
    model = "gebruikersactiviteiten"
    service = settings.LOG_SERVICE_URL


class GebruikersActiviteitenByBurgersLoader(SingleDataLoader):
    model = "gebruikersactiviteiten"
    service = settings.LOG_SERVICE_URL
    filter_item = "filter_burgers"

    def get_by_id(self, id):
        url = f"{self.service}/{self.model}/?{self.filter_item}={id}"
        response = requests.get(url)
        if not response.ok:
            raise GraphQLError(f"Upstream API responded: {response.text}")

        return response.json()["data"]

    def get_by_ids(self, ids):
        url = f"{self.service}/{self.model}/?{self.filter_item}={','.join([str(k) for k in ids])}"
        response = requests.get(url)
        if not response.ok:
            raise GraphQLError(f"Upstream API responded: {response.text}")

        return response.json()["data"]

    def get_by_ids_paged(self, ids, start=1, limit=20):
        url = f"{self.service}/{self.model}/?{self.filter_item}={','.join([str(k) for k in ids])}&start={start}&limit={limit}"
        response = requests.get(url)
        if not response.ok:
            raise GraphQLError(f"Upstream API responded: {response.text}")

        result = response.json()["data"]

        return {self.model: result, "count": response.json()["count"], "start": response.json()["start"],
                "limit": response.json()["limit"]}


class GebruikersActiviteitenByAfsprakenLoader(SingleDataLoader):
    model = "gebruikersactiviteiten"
    service = settings.LOG_SERVICE_URL
    filter_item = "filter_afspraken"

    def get_by_ids(self, ids):
        url = f"{self.service}/{self.model}/?{self.filter_item}={','.join([str(k) for k in ids])}"
        response = requests.get(url)
        if not response.ok:
            raise GraphQLError(f"Upstream API responded: {response.text}")

        return response.json()["data"]

    def get_by_ids_paged(self, ids, start=1, limit=20):
        url = f"{self.service}/{self.model}/?{self.filter_item}={','.join([str(k) for k in ids])}&start={start}&limit={limit}"
        response = requests.get(url)
        if not response.ok:
            raise GraphQLError(f"Upstream API responded: {response.text}")

        result = response.json()["data"]

        return {self.model: result, "count": response.json()["count"], "start": response.json()["start"],
                "limit": response.json()["limit"]}
