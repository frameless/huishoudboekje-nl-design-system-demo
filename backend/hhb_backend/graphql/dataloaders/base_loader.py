import json
from typing import Dict, Union, TypedDict

import requests
from graphql import GraphQLError
from typing_extensions import Unpack, NotRequired

from hhb_backend.graphql import settings
from hhb_backend.graphql.utils.upstream_error_handler import UpstreamError

# Possible formats:
#   {"<column_name>": <str|int|bool>}
#   {"<column_name>": {"<Operator>": <str|int|bool>}}
#   {"<AND|OR>": {...}
Filters = Dict[str, Union['Filters', str, int, bool]]


class DataLoaderOptions(TypedDict):
    model: NotRequired[str]
    filter_item: NotRequired[str]
    filters: NotRequired[Filters]
    params: NotRequired[dict[str, any]]
    batch_size: NotRequired[int]


class DataLoader:
    """ Dataloader for when the result is a single object """
    model = None
    service = settings.HHB_SERVICES_URL
    filter_item = "filter_ids"
    batch_size = 1000
    params = {}

    def __init__(self, loop):
        self.loop = loop

    def load(self, key: str | int | bool, **kwargs: Unpack[DataLoaderOptions]) -> dict:
        _add_default_options(self, **kwargs)
        return _base_data_load_with_options(self.service, key=key, **kwargs)

    def load_many(self, keys: list, **kwargs: Unpack[DataLoaderOptions]) -> list[dict]:
        _add_default_options(self, **kwargs)
        return _base_data_load_with_options(self.service, keys=keys, **kwargs)

    def load_all(self, **kwargs: Unpack[DataLoaderOptions]) -> list[dict]:
        return _base_data_load_with_options(self.service, **kwargs)

    def get_by_item_paged(self, key: str | None = None, keys: list[str] | None = None,
                          start: int = 1, limit: int = 20, desc: bool = False,
                          sorting_column: str = "id", **kwargs: Unpack[DataLoaderOptions]):
        _add_default_options(self, **kwargs)
        return _get_paged(
            self.service, key=key, keys=keys, start=start, limit=limit, desc=desc,
            sorting_column=sorting_column, **kwargs
        )

    def get_all_paged(self, start: int = 1, limit: int = 20, desc: bool = False,
                      sorting_column: str = "id", filters: Filters = None):
        return _get_paged(
            self.service, start=start, limit=limit, desc=desc, sorting_column=sorting_column, filters=filters
        )


def _get_options(**kwargs: Unpack[DataLoaderOptions]) -> (str, str, Filters, dict[str, any], bool):
    params = kwargs.get("params")
    if params:
        params = dict(params)  # we edit the dict in the request, so don't make permanent changes

    return kwargs.get("model"), kwargs.get("filter_item"), kwargs.get("filters", {}), params, kwargs.get("batch_size")


def _add_default_options(loader, **kwargs: Unpack[DataLoaderOptions]):
    kwargs.setdefault("model", loader.model)
    kwargs.setdefault("filter_item", loader.filter_item)
    kwargs.setdefault("params", loader.params)
    kwargs.setdefault("batch_size", loader.batch_size)


def _get_paged(service: str, key: str | None = None, keys: list[str] | None = None,
               start: int = 1, limit: int = 20, desc: bool = False,
               sorting_column: str = "id", **kwargs: Unpack[DataLoaderOptions]):
    params = {
        'start': start,
        'limit': limit,
        'desc': desc,
        'sortingColumn': sorting_column
    }

    # adds the filter_item and filters for us
    response = _base_load_with_options(
        service, params=params, key=key, keys=keys, **kwargs
    )

    return {
        kwargs["model"]: response["data"],
        "page_info": {
            "count": response["count"],
            "start": response["start"],
            "limit": response["limit"]
        }
    }


def _base_data_load_with_options(service: str, key=None, keys: list | None = None, **kwargs: Unpack[DataLoaderOptions]):
    model, filter_item, filters, params, batch_size = _get_options(**kwargs)

    if keys is not None and len(keys) > batch_size:
        result = []
        for i in range(0, len(keys), batch_size):
            part = _base_load_with_options(service, keys=keys[i::i + batch_size]).json()
            result.extend(part["data"])
        return result

    return _base_load_with_options(service, key=key, keys=keys, **kwargs).json()["data"]


def _base_load_with_options(service: str, key=None, keys: list | None = None, **kwargs: Unpack[DataLoaderOptions]):
    model, filter_item, filters, params, batch_size = _get_options(**kwargs)

    url = f"{service}/{model}"

    if filter_item:
        params[filter_item] = key if key is not None else ','.join([str(k) for k in keys])
    elif key is not None:
        url += str(key)

    if filters:
        params["filters"] = json.dumps(filters)

    return _send_get_request(url, service, params=params).json()


def _send_get_request(url, service, params=None, headers=None):
    try:
        response = requests.get(url, params=params, headers=headers)
    except requests.exceptions.ConnectionError:
        raise GraphQLError(f"Connectie error heeft plaatsgevonden op {service}")

    if response.status_code != 200:
        raise UpstreamError(response, f"Request to {url} not succeeded.")

    return response
