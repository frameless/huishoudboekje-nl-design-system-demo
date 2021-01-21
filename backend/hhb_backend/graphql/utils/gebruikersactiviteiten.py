import logging
from datetime import datetime

import requests
from dateutil import tz
from flask import request, g

from hhb_backend.graphql import settings


def entity_list(result: dict, key: str, entity_type: str) -> list:
    """Return a list of entities of a list of objects in a dictionary at 'key'"""
    if key not in result or not result[key]:
        return []
    return [({"entityType": entity_type, "entityId": item['id']}) for item in result[key]]


def gebruikersactiviteit(action: str, entities: list, before: dict, after: dict):
    logging.debug(f"action={action}, entities={entities}")
    json = {
        'timestamp': datetime.now(tz=tz.tzlocal()).replace(microsecond=0).isoformat(),
        'meta': {
            'userAgent': str(request.user_agent),
            'ip': ','.join(request.access_route),
            'applicationVersion': '0.0.0-mock',
        },

        'gebruiker_id': g.oidc_id_token["email"] if g.oidc_id_token is not None else None,
        'action': action,
        'entities': entities,
        'snapshot_before': before,
        'snapshot_after': after,
    }
    # TODO use a Queue and asyncio.run_task
    response = requests.post(
        f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/",
        json=json,
    )
    logging.debug(f"logged gebruikersactiviteit(status={response.text}) {gebruikersactiviteit}")