from dataclasses import dataclass
import os
from functools import lru_cache

from dataclasses_json import dataclass_json


@dataclass_json()
@dataclass(init=True)
class Version:
    version: str
    component: str = "unknown"
    tag: str = "unknown"
    commit: str = None

@lru_cache(maxsize=1)
def load_version() -> Version:
    try:
        with open(os.path.join(os.path.dirname(__file__), "version.json")) as json_file:
            return Version.from_json(json_file.read())
    except FileNotFoundError:
        return Version(version="0.3.0")

