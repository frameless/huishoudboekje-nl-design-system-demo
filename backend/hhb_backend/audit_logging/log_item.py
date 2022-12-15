import json
from dataclasses import dataclass, field, asdict, is_dataclass
from datetime import datetime, timezone

from hhb_backend.graphql.utils.dates import to_date


@dataclass
class LogItem:
    action: str
    entities: list[dict] = field(default_factory=lambda: [])
    timestamp: datetime = field(default=datetime.now(timezone.utc).replace(microsecond=0).isoformat())
    before: dict = field(default=None)
    after: dict = field(default=None)
    user: str = field(default=None)
    meta: dict = field(default_factory=lambda: {
        "user_agent": None,
        "ip": None
    })

    def to_dict(self):
        return asdict(self)