import json
from typing import Dict, Union

import requests
from graphql import GraphQLError
from aiodataloader import DataLoader
from hhb_backend.graphql import settings


# Possible formats:
#   {"<column_name>": <str|int|bool>}
#   {"<column_name>": {"<Operator>": <str|int|bool>}}
#   {"<AND|OR>": {...}
Filters = Dict[str, Union['Filters', str, int, bool]]


class SingleDataLoader(DataLoader):
    """ Dataloader for when the result is a single object """
    model = None
    service = settings.HHB_SERVICES_URL
    filter_item = "filter_ids"
    index = "id"
    batch_size = 1000

    def url_for(self, keys=None):
        return f"""{self.service}/{self.model}/{f"?{self.filter_item}={','.join([str(k) for k in keys])}" if keys else ''}"""

    def get_all_and_cache(self, filters: Filters = None):
        params = {
            'filters': json.dumps(filters) if filters else None
        }
        if self.service == settings.CONTACTCATALOGUS_SERVICE_URL:
            response = requests.get(url=f"{self.service}/{self.model}/",
                                    params=params, headers={
                    "Authorization": "45c1a4b6-59d3-4a6e-86bf-88a872f35845"})
        else:
            response = requests.get(url=f"{self.service}/{self.model}/",
                                    params=params)

        try:
            if not response.ok:
                raise GraphQLError(f"Upstream API responded: {response.text}")
        except:
            if response.status_code != 201:
                raise GraphQLError(f"Upstream API responded: {response.text}")

        if self.service == settings.CONTACTCATALOGUS_SERVICE_URL:
            result = response.json()['hydra:member']
        else:
            result = response.json()["data"]

            # Prime the cache with the complete result set to prevent unnecessary extra calls
            for item in result:
                self.prime(item[self.index], item)

        return result

    def get_all_paged(self, start: int = 1, limit: int = 20, desc: bool = False,
                      sortingColumn: str = "id", filters: Filters = None):
        params = {
            'start': start,
            'limit': limit,
            'desc': desc,
            'sortingColumn': sortingColumn,
            'filters': json.dumps(filters) if filters else None
        }
        response = requests.get(url=f"{self.service}/{self.model}/", params=params)

        if not response.ok:
            raise GraphQLError(f"Upstream API responded: {response.text}")
        result = response.json()["data"]

        # Prime the cache with the complete result set to prevent unnecessary extra calls
        for item in result:
            self.prime(item[self.index], item)

        page_info = {"count": response.json()["count"], "start": response.json()["start"],
                     "limit": response.json()["limit"]}

        return_obj = {self.model: result, "page_info": page_info}

        return return_obj

    async def batch_load_fn(self, keys):
        objects = {}
        for i in range(0, len(keys), self.batch_size):
            url = self.url_for(keys[i:i + self.batch_size])
            if self.service == settings.CONTACTCATALOGUS_SERVICE_URL:
                response = requests.get(url, headers={ "Authorization": "45c1a4b6-59d3-4a6e-86bf-88a872f35845" })
            else:
                response = requests.get(url)
            try:
                if not response.ok:
                    raise GraphQLError(f"Upstream API responded: {response.text}")
            except:
                if response.status_code != 200:
                    raise GraphQLError(f"Upstream API responded: {response.text}")
            if self.service == settings.CONTACTCATALOGUS_SERVICE_URL:
                for item in response.json()["hydra:member"]:
                    objects[item[self.index]] = item
            else:
                for item in response.json()["data"]:
                    objects[item[self.index]] = item
        return [objects.get(key, None) for key in keys]

    async def auth_load_many(self, keys):
        if keys is None:
            return
        objects = {}
        for i in keys:
            url = f"""{self.service}/{self.model}/{f"{i}"}"""
            response = requests.get(url, headers={
                        "Authorization": "45c1a4b6-59d3-4a6e-86bf-88a872f35845"})
            try:
                if not response.ok:
                    raise GraphQLError(f"Upstream API responded: {response.text}")
            except:
                if response.status_code != 200:
                    raise GraphQLError(f"Upstream API responded: {response.text}")

            result = response.json()
            objects[i] = result

        return [objects.get(key, None) for key in keys]


    async def auth_load(self, key):
        url = f"""{self.service}/{self.model}/{key}"""
        response = requests.get(url, headers={"Authorization": "45c1a4b6-59d3-4a6e-86bf-88a872f35845"})
        try:
            if not response.ok:
                raise GraphQLError(f"Upstream API responded: {response.text}")
        except:
            if response.status_code != 200:
                raise GraphQLError(f"Upstream API responded: {response.text}")

        result = response.json()

        return result

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
        try:
            if not response.ok:
                raise GraphQLError(f"Upstream API responded: {response.text}")
        except:
            if response.status_code != 200:
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
        return [objects.get(key, []) for key in keys]

    def get_all_paged(self, keys, start: int = 1, limit: int = 20, desc: bool = False,
                      sortingColumn: str = "id", filters: Filters = None):
        params = {
            f'{self.filter_item}': ','.join([str(k) for k in keys]),
            'start': start,
            'limit': limit,
            'desc': desc,
            'sortingColumn': sortingColumn,
            'filters': json.dumps(filters) if filters else None
        }
        response = requests.get(url=f"{self.service}/{self.model}/", params=params)

        if not response.ok:
            raise GraphQLError(f"Upstream API responded: {response.text}")
        result = response.json()["data"]

        # Prime the cache with the complete result set to prevent unnecessary extra calls
        for item in result:
            self.prime(item[self.index], item)

        page_info = {"count": response.json()["count"], "start": response.json()["start"],
                     "limit": response.json()["limit"]}

        return_obj = {self.model: result, "page_info": page_info}

        return return_obj
