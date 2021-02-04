import inspect
import logging
from dataclasses import dataclass, field
from functools import wraps

from dataclasses_json import dataclass_json, LetterCase, config

from datetime import datetime
from typing import List

import requests
from dateutil import tz
from flask import request, g

from hhb_backend.graphql import settings
from hhb_backend.version import load_version


@dataclass_json(letter_case=LetterCase.CAMEL)
@dataclass
class GebruikersActiviteitEntity:
    entity_type: str = field(default=None, metadata=config(field_name="entityType"))
    entity_id: int = field(default=None, metadata=config(field_name="entityId"))


@dataclass_json(letter_case=LetterCase.CAMEL)
@dataclass
class GebruikersActiviteit:
    action: str
    entities: List[GebruikersActiviteitEntity]
    before: dict = field(default=None, metadata=config(field_name="snapshot_before"))
    after: dict = field(default=None, metadata=config(field_name="snapshot_after"))

    def map_entities(self):
        """Map all entities to their DataClass """
        self.entities = [
            entity
            if type(entity) == GebruikersActiviteitEntity
            else GebruikersActiviteitEntity(**entity)
            for entity in (self.entities or [])
        ]
        return self


def extract_gebruikers_activiteit(result, *args, **kwargs):
    """Return a dict of the GebruikersActiviteit DataClass from the result by reading its gebruikers_activiteit property"""
    if hasattr(result, "gebruikers_activiteit"):
        gebruikers_activiteit = result.gebruikers_activiteit
    elif inspect.isclass(args[0]) and hasattr(args[0], "gebruikers_activiteit"):
        gebruikers_activiteit = args[0].gebruikers_activiteit(
            *(args[1:]), **{**kwargs, "result": result}
        )
    else:
        return None

    if type(gebruikers_activiteit) == dict:
        gebruikers_activiteit = GebruikersActiviteit(**(gebruikers_activiteit))

    return gebruikers_activiteit.map_entities().to_dict()


def log_gebruikers_activiteit(view_func):
    """Decorate graphql mutations with this to have the gebruikers_activiteit property of their response be logged to
    the LOG_SERVICE"""

    @wraps(view_func)
    async def decorated(*args, **kwargs):  # TODO add root, info to signature
        # cls = args[0] if inspect.isclass(args[0]) else None
        #     (cls, args) = args[0], args[1:]
        result = await view_func(*args, **kwargs)
        gebruikers_activiteit = extract_gebruikers_activiteit(result, *args, **kwargs)
        if gebruikers_activiteit:
            try:
                # TODO find out why snapshots are sometime logged as a string 'null'
                json = {
                    "timestamp": datetime.now(tz=tz.tzlocal())
                    .replace(microsecond=0)
                    .isoformat(),
                    "meta": {
                        "userAgent": str(request.user_agent) if request else None,
                        "ip": ",".join(request.access_route) if request else None,
                        "applicationVersion": load_version().version,  # Read version.json
                    },
                    "gebruiker_id": g.oidc_id_token["email"]
                    if g and g.oidc_id_token is not None
                    else None,
                    **(gebruikers_activiteit),
                }
                # TODO use a Queue and asyncio.run_task
                response = requests.post(
                    f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/",
                    json=json,
                )
                logging.debug(
                    f"logged gebruikersactiviteit(status={response.status_code}) {json}"
                )
            except:
                logging.exception(f"Failed to log {gebruikers_activiteit}")

        return result

    return decorated


def gebruikers_activiteit_entities(
    entity_type: str, result, key: str = None
) -> List[GebruikersActiviteitEntity]:
    """Return a list of entities of a list of objects in a dictionary at 'key'"""
    value = None
    if result:
        if type(result) == dict:
            value = result[key] if key in result else None
        elif (
            isinstance(result, int)
            or isinstance(result, str)
            or isinstance(result, list)
        ):
            value = result
        elif inspect.isclass(type(result)):
            value = vars(result)[key] if key in vars(result) else None

    if not value:
        return []

    if type(value) == list:
        return [
            (
                GebruikersActiviteitEntity(
                    entity_type=entity_type,
                    entity_id=item["id"] if type(item) == dict else item,
                )
            )
            for item in value
        ]
    if type(value) == dict:
        return [
            GebruikersActiviteitEntity(entity_type=entity_type, entity_id=value["id"])
        ]
    return [GebruikersActiviteitEntity(entity_type=entity_type, entity_id=value)]
