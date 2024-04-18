import json
import logging
import time
import pika
from flask import g, request

from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity
from hhb_backend.audit_logging.settings import RABBBITMQ_HOST, RABBBITMQ_PASS, RABBBITMQ_PORT, RABBBITMQ_USER
from hhb_backend.audit_logging.log_item import LogItem
from graphql import GraphQLError


class AuditLogging:
    def __init__(self):
        logging.debug(f"AuditLogging: initialized")

    @staticmethod
    def create(action: str, logRequest: bool = False,  entities: list[GebruikersActiviteitEntity] = None, before: any = None, after: any = None):
        logging.debug(f"AuditLogging: creating log...")

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

        if logRequest:
            action = action + "LogRequest"

        # Create the log item
        item = LogItem(
            action=action,
            entities=entities if entities is not None else [],
            before=before,
            after=after,
            timestamp=int(time.time()),
            user=user,
            meta={
                "user_agent": user_agent,
                "ip": ip
            },
        )

        logging.debug(f"AuditLogging: log item: {item}")

        # Send the log item to the log service

        message ={
                    **item.to_dict(),
                    "userid": item.user,
                    "snapshotbefore": str(item.before),
                    "snapshotafter": str(item.after),
                }
        message["meta"] = str(item.meta)
        
        logging.debug(f"Sending log sent to message broker...")

        try:
            credentials = pika.PlainCredentials(RABBBITMQ_USER, RABBBITMQ_PASS)
            connection = pika.BlockingConnection(pika.ConnectionParameters(RABBBITMQ_HOST, RABBBITMQ_PORT, '/', credentials))
        except Exception:
            logging.exception("Failed to connect to RabbitMQ service. AuditLogging wont be sent.")
            raise GraphQLError("Error connecting to auditlogger")

        channel = connection.channel()
        channel.queue_declare(queue='user-activity-log', durable=True)
        body = json.dumps(message)
        channel.basic_publish(
            exchange='',
            routing_key='user-activity-log',
            body= body,
            properties=pika.BasicProperties(
                delivery_mode=2,  # make message persistent
            ))
        connection.close()
        logging.debug(f"AuditLogging: log sent to message broker")
