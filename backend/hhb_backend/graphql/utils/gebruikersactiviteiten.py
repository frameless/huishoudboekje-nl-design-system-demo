from dataclasses import dataclass, field
from typing import List

from dataclasses_json import dataclass_json, config


@dataclass_json
@dataclass
class GebruikersActiviteitEntity:
    entityType: str = field(default=None, metadata=config(field_name="entityType"))
    entityId: str = field(default=None, metadata=config(field_name="entityId"))


@dataclass_json
@dataclass
class GebruikersActiviteit:
    action: str
    entities: List[GebruikersActiviteitEntity]
    before: dict = field(default=None, metadata=config(field_name="snapshotBefore"))
    after: dict = field(default=None, metadata=config(field_name="snapshotAfter"))

    def map_entities(self):
        """Map all entities to their DataClass """
        self.entities = [
            (GebruikersActiviteitEntity(**entity) if type(entity) == dict else entity)
            for entity in (self.entities or [])
        ]
        return self
