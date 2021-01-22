import logging
import typing
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
    entity_type: str
    entity_id: int


@dataclass_json(letter_case=LetterCase.CAMEL)
@dataclass
class GebruikersActiviteit:
    action: str
    entities: List[GebruikersActiviteitEntity]
    before: dict = field(default=None, metadata=config(field_name="snapshot_before"))
    after: dict = field(default=None, metadata=config(field_name="snapshot_after"))


def log_gebruikers_activiteit(view_func):
    @wraps(view_func)
    async def decorated(*args, **kwargs):
        result = await view_func(*args, **kwargs)
        try:
            json = {
                'timestamp': datetime.now(tz=tz.tzlocal()).replace(microsecond=0).isoformat(),
                'meta': {
                    'userAgent': str(request.user_agent),
                    'ip': ','.join(request.access_route),
                    'applicationVersion': load_version().version,  # Read version.json
                },
                'gebruiker_id': g.oidc_id_token["email"] if g.oidc_id_token is not None else None,
                **(result.gebruikers_activiteit.to_dict()),
            }
            # TODO use a Queue and asyncio.run_task
            response = requests.post(
                f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/",
                json=json,
            )
            logging.debug(f"logged gebruikersactiviteit(status={response.status_code}) {json}")
        except:
            logging.exception(f"Failed to log {result.gebruikers_activiteit.to_dict()}")

        return result
    return decorated

def gebruikers_activiteit_entities(result: dict, key: str, entity_type: str) -> List[GebruikersActiviteitEntity]:
    """Return a list of entities of a list of objects in a dictionary at 'key'"""
    if key not in result or not result[key]:
        return []
    return [(GebruikersActiviteitEntity(entity_type=entity_type, entity_id=item['id'])) for item in result[key]]
