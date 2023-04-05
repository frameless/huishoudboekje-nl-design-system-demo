import logging
from typing import Dict, get_args, get_type_hints, get_origin, Union, Tuple

_class_cache = {}
_attribute_cache = {}


class _ClassCache:
    model_type: type

    def __init__(self, model_type: type):
        self.model_type = model_type


class _AttributeCache:
    attributes: Dict[str, Tuple[bool, type]]

    def __init__(self, attributes: Dict[str, Tuple[bool, type]]):
        self.attributes = attributes


def get_model_type(self) -> type:
    return _get_or_cache_class(self.__class__)


def get_type_hint(self, item) -> (bool, type):
    return _get_or_cache_attributes(self.__class__).get(item, (False, _none_type()))


def _get_or_cache_class(cls):
    cache = _class_cache.get(cls)
    if not cache:
        logging.debug(f"caching class: {cls}")
        cache = _model_type(cls)
        _class_cache[cls] = cache
    return cache


def _get_or_cache_attributes(cls):
    cache = _attribute_cache.get(cls)
    if not cache:
        logging.debug(f"caching attributes: {cls}")
        cache = _attributes(cls)
        _attribute_cache[cls] = cache
    return cache


def _model_type(cls):
    # limitation: it can only support one base class with generics,
    # and it can only fetch the first generic of that generic class
    base_classes = cls.__orig_bases__
    if not base_classes:
        raise RuntimeError(f"Cannot cache {cls} as it doesn't have a base class")

    for base_class in base_classes:
        args = get_args(base_class)
        if args:
            return args[0]

    raise RuntimeError(f"Cannot cache {cls} as it doesn't have a Generic base class")


def _attributes(cls):
    dict = {}
    for name, type in get_type_hints(cls).items():
        dict[name] = _unwrap_optional(type)
    return dict


def _unwrap_optional(type) -> (bool, type):
    if get_origin(type) is Union:
        args = get_args(type)
        if len(args) == 2 and args[1] is _none_type():
            return True, args[0]
    return False, type


def _none_type():
    # Python 3.10 re-added NoneType, but we're still on 3.8
    return None.__class__  # type: ignore
