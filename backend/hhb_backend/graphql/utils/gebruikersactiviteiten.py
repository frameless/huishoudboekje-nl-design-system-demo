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


def extract_gebruikers_activiteit(result):
    """Return a dict of the GebruikersActiviteit DataClass from the result by reading its gebruikers_activiteit property"""

    # Map the gebruikers_activiteit to a DataClass
    gebruikers_activiteit = result.gebruikers_activiteit \
        if type(result.gebruikers_activiteit) == GebruikersActiviteit \
        else GebruikersActiviteit(**(result.gebruikers_activiteit))

    # Map all entities to their DataClass
    gebruikers_activiteit.entities = [
        entity \
            if type(entity) == GebruikersActiviteitEntity \
            else GebruikersActiviteitEntity(**entity)
        for entity in (gebruikers_activiteit.entities or [])
    ]
    return gebruikers_activiteit.to_dict()

def log_gebruikers_activiteit(view_func):
    """Decorate graphql mutations with this to have the gebruikers_activiteit property of their response be logged to
    the LOG_SERVICE"""
    @wraps(view_func)
    async def decorated(*args, **kwargs):
        result = await view_func(*args, **kwargs)
        gebruikers_activiteit = extract_gebruikers_activiteit(result)
        try:
            json = {
                'timestamp': datetime.now(tz=tz.tzlocal()).replace(microsecond=0).isoformat(),
                'meta': {
                    'userAgent': str(request.user_agent) if request else None,
                    'ip': ','.join(request.access_route) if request else None,
                    'applicationVersion': load_version().version,  # Read version.json
                },
                'gebruiker_id': g.oidc_id_token["email"] if g and g.oidc_id_token is not None else None,
                **(gebruikers_activiteit),
            }
            # TODO use a Queue and asyncio.run_task
            response = requests.post(
                f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/",
                json=json,
            )
            logging.debug(f"logged gebruikersactiviteit(status={response.status_code}) {json}")
        except:
            logging.exception(f"Failed to log {gebruikers_activiteit}")

        return result
    return decorated


def gebruikers_activiteit_entities(result: dict, key: str, entity_type: str) -> List[GebruikersActiviteitEntity]:
    """Return a list of entities of a list of objects in a dictionary at 'key'"""
    value = None
    if result:
        if type(result) == dict:
            value = result[key] if key in result else None
        elif inspect.isclass(type(result)):
            value = vars(result)[key] if key in vars(result) else None

    if not value:
        return []

    if type(value) == list:
        return [(GebruikersActiviteitEntity(entity_type=entity_type, entity_id=item["id"])) for item in value]
    if type(value) == dict:
        return [GebruikersActiviteitEntity(entity_type=entity_type, entity_id=value["id"])]
    return [GebruikersActiviteitEntity(entity_type=entity_type, entity_id=value)]
