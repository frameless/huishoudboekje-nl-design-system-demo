import copy
import json
import logging
from typing import Dict, Union, TypedDict, List, Optional

import requests
from graphql import GraphQLError
from typing_extensions import Unpack, NotRequired

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
    return_first: NotRequired[bool]
    return_indexed: NotRequired[str]


class DataLoader:
    service = None
    model = None
    filter_item = None  # will fall back to 'filter_ids'
    batch_size = 1000
    params = {}

    def load_one(self, key: Key, **kwargs: Unpack[DataLoaderOptions]) -> Optional[dict]:
        """ Loads one to one data """
        options = _add_default_options(self, kwargs)
        options["return_first"] = True
        return _base_data_load_with_options(self.service, options, key=key)

    def load(self, keys: Union[List[Key], Key], **kwargs: Unpack[DataLoaderOptions]) -> List[dict]:
        """
         Loads one to many, many to many and many to one
         (when used in combination with the return_first option) data
         """
        # remove duplicated keys and make sure that keys is always a list (for one to many)
        keys = _remove_duplicated_keys(keys) if type(keys) == list else [keys]
        options = _add_default_options(self, kwargs)
        return _base_data_load_with_options(self.service, options, keys=keys)

    def load_all(self, **kwargs: Unpack[DataLoaderOptions]) -> List[dict]:
        """ Load all items """
        options = _add_default_options(self, kwargs)
        return _base_data_load_with_options(self.service, options)

    def load_paged(self, key: Key = None, keys: List[Key] = None,
                   start: int = 1, limit: int = 20, desc: bool = False,
                   sorting_column: str = "id", **kwargs: Unpack[DataLoaderOptions]):
        """
        Load items paged. When either key or keys is specified the results will be limited to that key/those keys.
        """
        options = _add_default_options(self, kwargs)
        return _load_paged(
            self.service, options, key=key, keys=keys, start=start, limit=limit, desc=desc,
            sorting_column=sorting_column
        )

    def __getitem__(self, item):
        return getattr(self, item)


def _remove_duplicated_keys(keys: List[Key]) -> List[Key]:
    deduplicated = []
    for key in keys:
        if key not in deduplicated:
            deduplicated.append(key)
    return deduplicated


def _get_options(options: Unpack[DataLoaderOptions]) -> (str, str, Filters, Dict[str, any], int, bool, bool, str):
    options = copy.deepcopy(options)
    return options.get("model"), options.get("filter_item"), options.get("filters", {}), options.get("params"),\
           options.get("batch_size"), options.get("return_first"), options.get("return_indexed")


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


def _load_paged(service: str, options: Unpack[DataLoaderOptions],
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
    response = _base_load_with_options(service, options, key=key, keys=keys)

    return {
        options["model"]: response["data"],
        "page_info": {
            "count": response["count"],
            "start": response["start"],
            "limit": response["limit"]
        }
    }


def _base_data_load_with_options(service: str, options: Unpack[DataLoaderOptions], key=None, keys: List[Key] = None):
    _, _, _, _, batch_size, return_first, return_indexed = _get_options(options)

    if keys is not None:
        if len(keys) > batch_size:
            result = []
            for i in range(0, len(keys), batch_size):
                part, _ = _base_load_with_options(service, options, keys=keys[i::i + batch_size])
                result.extend(part["data"])
            return result

    data = _base_load_with_options(service, options, key=key, keys=keys)["data"]

    if return_first:
        data = data[0] if len(data) > 0 else None
    elif return_indexed is not None:
        indexed = {}
        for item in data:
            indexed.setdefault(item[return_indexed], item)
        data = indexed

    logging.info(f"response: {data}")
    return data


def _base_load_with_options(service: str, options: Unpack[DataLoaderOptions], key=None, keys: List[Key] = None) -> dict:
    logging.info(options)
    logging.info(locals())
    model, filter_item, filters, params, _, _, _ = _get_options(options)

    url = f"{service}/{model}/"
    key_data = ','.join([str(k) for k in keys]) if keys is not None else key

    if key_data is not None:
        # we can't set a default value for filter_item because
        # otherwise we can't do the single check in load (single)
        if filter_item is None:
            filter_item = "filter_ids"
        params[filter_item] = key_data

    if filters:
        params["filters"] = json.dumps(filters)

    logging.info(f"requesting: get, {url}, {params}")
    response = _send_get_request(url, service, params=params).json()
    logging.info(f"response: {response}")
    return response


def _send_get_request(url, service, params=None, headers=None):
    try:
        response = requests.get(url, params=params, headers=headers)
    except requests.exceptions.ConnectionError:
        raise GraphQLError(f"Connectie error heeft plaatsgevonden op {service}")

    if response.status_code != 200:
        raise UpstreamError(response, f"Request to {url} {params} failed.")

    return response
