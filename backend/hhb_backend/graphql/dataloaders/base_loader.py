import copy
import json
import logging
from typing import Dict, Union, TypedDict, List

import requests
from graphql import GraphQLError
from typing_extensions import Unpack, NotRequired

from hhb_backend.graphql import settings
from hhb_backend.graphql.utils.upstream_error_handler import UpstreamError

Key = Union[str, int, bool]

# Possible formats:
#   {"<column_name>": <str|int|bool>}
#   {"<column_name>": {"<Operator>": <str|int|bool>}}
#   {"<AND|OR>": {...}
Filters = Dict[str, Union['Filters', Key]]


class DataLoaderOptions(TypedDict):
    model: NotRequired[str]
    filter_item: NotRequired[str]
    filters: NotRequired[Filters]
    params: NotRequired[Dict[str, any]]
    batch_size: NotRequired[int]


class DataLoader:
    """ Dataloader for when the result is a single object """
    model = None
    service = settings.HHB_SERVICES_URL
    filter_item = None # will fall back to 'filter_ids'
    batch_size = 1000
    params = {}

    def __init__(self, loop):
        self.loop = loop

    def load(self, key: Key, **kwargs: Unpack[DataLoaderOptions]) -> dict:
        options = _add_default_options(self, kwargs)
        return _base_data_load_with_options(self.service, options, key=key)

    def load_many(self, keys: List[Key], **kwargs: Unpack[DataLoaderOptions]) -> List[dict]:
        options = _add_default_options(self, kwargs)
        return _base_data_load_with_options(self.service, options, keys=keys)

    def load_all(self, **kwargs: Unpack[DataLoaderOptions]) -> List[dict]:
        options = _add_default_options(self, kwargs)
        return _base_data_load_with_options(self.service, options)

    def get_by_item_paged(self, key: Key = None, keys: List[Key] = None,
                          start: int = 1, limit: int = 20, desc: bool = False,
                          sorting_column: str = "id", **kwargs: Unpack[DataLoaderOptions]):
        options = _add_default_options(self, kwargs)
        return _get_paged(
            self.service, options, key=key, keys=keys, start=start, limit=limit, desc=desc,
            sorting_column=sorting_column
        )

    def get_all_paged(self, start: int = 1, limit: int = 20, desc: bool = False,
                      sorting_column: str = "id", filters: Filters = None):
        # todo test uncommented code
        return self.get_by_item_paged(
            start=start, limit=limit, desc=desc, sorting_column=sorting_column, filters=filters
        )
        # return _get_paged(
        #     self.service, start=start, limit=limit, desc=desc, sorting_column=sorting_column, filters=filters
        # )

    def __getitem__(self, item):
        return getattr(self, item)


def _get_options(options: Unpack[DataLoaderOptions]) -> (str, str, Filters, Dict[str, any], bool):
    options = copy.deepcopy(options)
    return options.get("model"), options.get("filter_item"), options.get("filters", {}), \
           options.get("params"), options.get("batch_size")


def _add_default_options(loader, options: Unpack[DataLoaderOptions]):
    # be aware that this function doesn't make a copy of the data its adding.
    # it's not a problem because as of writing this _get_options is used and that makes a deep copy of the options.
    _add_default_option(options, "model", loader)
    _add_default_option(options, "filter_item", loader)
    _add_default_option(options, "params", loader)
    _add_default_option(options, "batch_size", loader)
    return options


def _add_default_option(options: dict, option, loader: DataLoader):
    if options.get(option) is None:
        options[option] = loader[option]


def _get_paged(service: str, options: Unpack[DataLoaderOptions],
               key: Key = None, keys: List[Key] = None,
               start: int = 1, limit: int = 20, desc: bool = False,
               sorting_column: str = "id"):
    options["params"] = {
        'start': start,
        'limit': limit,
        'desc': desc,
        'sortingColumn': sorting_column
    }

    # adds the filter_item and filters for us
    response, _ = _base_load_with_options(service, options, key=key, keys=keys)

    return {
        options["model"]: response["data"],
        "page_info": {
            "count": response["count"],
            "start": response["start"],
            "limit": response["limit"]
        }
    }


def _base_data_load_with_options(service: str, options: Unpack[DataLoaderOptions], key=None, keys: List[Key] = None):
    if keys is not None:
        model, filter_item, filters, params, batch_size = _get_options(options)
        if len(keys) > batch_size:
            result = []
            for i in range(0, len(keys), batch_size):
                part, _ = _base_load_with_options(service, options, keys=keys[i::i + batch_size])
                result.extend(part["data"])
            return result

    response, is_single = _base_load_with_options(service, options, key=key, keys=keys)
    data = response["data"]
    if is_single:
        if len(data) > 0:
            data = data[0]
        else:
            raise UpstreamError(
                response,
                f"Failed to find {options['model']} with id(s): {key if key is not None else keys}"
            )
    logging.info(f"response: {data}")
    return data


def _base_load_with_options(service: str, options: Unpack[DataLoaderOptions], key=None, keys: List[Key] = None):
    logging.info(options)
    logging.info(locals())
    model, filter_item, filters, params, batch_size = _get_options(options)

    url = f"{service}/{model}/"

    # when single we need to retrieve the one object out of the array
    is_single = False

    # we can't set a default value for filter_item because otherwise we
    if key is not None:
        if not filter_item:
            is_single = True
            filter_item = "filter_ids"
        params[filter_item] = key
    elif keys is not None:
        if not filter_item:
            filter_item = "filter_ids"
        params[filter_item] = ','.join([str(k) for k in keys])

    if filters:
        params["filters"] = json.dumps(filters)

    return _send_get_request(url, service, params=params).json(), is_single


def _send_get_request(url, service, params=None, headers=None):
    try:
        response = requests.get(url, params=params, headers=headers)
    except requests.exceptions.ConnectionError:
        raise GraphQLError(f"Connectie error heeft plaatsgevonden op {service}")

    if response.status_code != 200:
        raise UpstreamError(response, f"Request to {url} not succeeded.")

    return response
