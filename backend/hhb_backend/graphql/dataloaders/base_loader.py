import requests
from graphql import GraphQLError
from promise import Promise
from aiodataloader import DataLoader
from hhb_backend.graphql import settings

class SingleDataLoader(DataLoader):
    """ Dataloader for when the result is a single object """
    model = None
    service = settings.HHB_SERVICES_URL
    filter_item = "filter_ids"
    index = "id"

    async def batch_load_fn(self, keys):
        url = f"{self.service}/{self.model}/?{self.filter_item}={','.join([str(k) for k in keys])}"
        response = requests.get(url)
        if response.status_code != 200:
            raise GraphQLError(f"Upstream API responded: {response.json()}")
        objects = {}
        for item in response.json()["data"]:
            objects[item[self.index]] = item
        return [objects.get(key, None) for key in keys]


class ListDataLoader(DataLoader):
    """ Dataloader for when the result is a list of objects """
    model = None
    service = settings.HHB_SERVICES_URL
    filter_item = None
    index = None
    is_list = False # elements in the result list are lists as well (1-n vs n-n)

    async def batch_load_fn(self, keys):
        response = requests.get(f"{self.service}/{self.model}/?{self.filter_item}={','.join([str(k) for k in keys])}")
        if response.status_code != 200:
            raise GraphQLError(f"Upstream API responded: {response.json()}")
        objects = {}
        for item in response.json()["data"]:
            if self.is_list:
                for index in item[self.index]:
                    if index not in objects:
                        objects[index] = list()
                    objects[index].append(item)
            else:
                if item[self.index] not in objects:
                    objects[item[self.index]] = list()
                objects[item[self.index]].append(item)
        return [objects.get(key, None) for key in keys]
