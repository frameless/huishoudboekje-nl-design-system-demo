from typing import get_origin, Generic, TypeVar, overload

from typing_extensions import Unpack

from hhb_backend.utils.type_cache import get_type_hint, get_model_type

T = TypeVar('T', bound="BaseModel")


class BaseModel(dict, Generic[T]):
    @overload
    def __init__(self, **kwargs: Unpack[T]):
        ...

    @overload
    def __init__(self, data: dict):
        ...

    def __init__(self, _data: dict = None, **kwargs):
        # todo validate if all required data is present??
        super().__init__(_data or kwargs)

    def __getattr__(self, name):
        data = self.get(name)

        is_optional, real_type = get_type_hint(self, name)

        if data is None:
            if not is_optional:
                raise AttributeError(
                    f"Unable to find required attribute '{name}' in [{','.join(self.keys())}]."
                    f" Model: {self.__class__}"
                )
            return None

        # also convert subtypes
        if get_origin(real_type) is dict:
            return get_model_type(real_type)(data)

        return data

    def __setattr__(self, name, value):
        # todo might be nice to add type validation in here so we can rely on the types
        self[name] = value

    def __delattr__(self, name):
        if name not in self:
            raise AttributeError(f"No such attribute '{name}' in [{','.join(self.keys())}]. Model: {self.__class__}")
        del self[name]
