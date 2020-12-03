import requests
from graphql import GraphQLError
from aiodataloader import DataLoader
from hhb_backend.graphql import settings


class SingleDataLoader(DataLoader):
    """ Dataloader for when the result is a single object """
    model = None
    service = settings.HHB_SERVICES_URL
    filter_item = "filter_ids"
    index = "id"

    def url_for(self, keys=None):
        return f"""{self.service}/{self.model}/{f"?{self.filter_item}={','.join([str(k) for k in keys])}" if keys else ''}"""

    def get_all_and_cache(self):
        response = requests.get(self.url_for())

        if not response.ok:
            raise GraphQLError(f"Upstream API responded: {response.text}")
        result = response.json()["data"]

        # Prime the cache with the complete result set to prevent unnecessary extra calls
        for item in result:
            self.prime(item[self.index], item)

        return result

    async def batch_load_fn(self, keys):
        objects = {}
        batch_size = 250
        for i in range(0, len(keys), batch_size):
            url = self.url_for(keys[i:i+batch_size])
            response = requests.get(url)
            if not response.ok:
                raise GraphQLError(f"Upstream API responded: {response.text}")
        
            for item in response.json()["data"]:
                objects[item[self.index]] = item
        return [objects.get(key, None) for key in keys]


class ListDataLoader(DataLoader):
    """ Dataloader for when the result is a list of objects """
    model = None
    service = settings.HHB_SERVICES_URL
    filter_item = None
    index = None
    is_list = False  # elements in the result list are lists as well (1-n vs n-n)

    async def batch_load_fn(self, keys):
        url = f"{self.service}/{self.model}/?{self.filter_item}={','.join([str(k) for k in keys])}"
        response = requests.get(url)
        if not response.ok:
            raise GraphQLError(f"Upstream API responded: {response.text}")
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
