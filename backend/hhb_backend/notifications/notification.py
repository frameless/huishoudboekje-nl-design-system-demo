import time
from dataclasses import dataclass, field, asdict, is_dataclass
from datetime import datetime, timezone

from hhb_backend.graphql.utils.dates import to_date


@dataclass
class Notification:
    message: str
    title: str | None
    additionalProperties: dict

    def to_dict(self):
        return asdict(self)
