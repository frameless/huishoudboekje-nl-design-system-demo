import logging

import requests
from flask import g, request

from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity
from hhb_backend.graphql.settings import LOG_SERVICE_URL
from .log_item import LogItem


class AuditLogging:
    def __init__(self):
        logging.info(f"AuditLogging: initialized")

    @staticmethod
    def create(action: str, entities: list[GebruikersActiviteitEntity] = None, before: any = None, after: any = None):
        logging.info(f"AuditLogging: creating log...")

        # Try to find the user
        user = None
        if g and "current_user" in g and g.current_user.name is not None:
            user = g.current_user.name

        # Try to find the user agent
        user_agent = None
        if request and request.user_agent is not None:
            user_agent = str(request.user_agent)

        # Try to find the ip address
        ip = None
        if request and request.access_route is not None:
            ip = ",".join(request.access_route)

        # Create the log item
        item = LogItem(
            action=action,
            entities=entities if entities is not None else [],
            before=before,
            after=after,
            user=user,
            meta={
                "user_agent": user_agent,
                "ip": ip
            },
        )

        logging.info(f"AuditLogging: log item: {item}")

        # Send the log item to the log service
        try:
            url = f"{LOG_SERVICE_URL}/gebruikersactiviteiten/"
            print(f"url {url}")

            response = requests.post(
                url,
                json={
                    **item.to_dict(),
                    "gebruiker_id": item.user,
                    "snapshot_before": item.before,
                    "snapshot_after": item.after,
                },
                headers={"Accept": "application/json", "Content-type": "application/json"}
            )

            if response.status_code != 201:
                logging.warning(f"AuditLogging: could not create audit log: {response.json()}")
            else:
                logging.info(f"AuditLogging: log created")
                logging.debug(f"AuditLogging: response {response}")

            return response
        except Exception as e:
            logging.exception(f"AuditLogging: error: {e}")
