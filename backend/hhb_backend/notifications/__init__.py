import json
import logging
import pika

from hhb_backend.notifications.settings import RABBBITMQ_HOST, RABBBITMQ_PASS, RABBBITMQ_PORT, RABBBITMQ_USER
from hhb_backend.notifications.notification import Notification
from graphql import GraphQLError


class Notificator:
    def __init__(self):
        logging.debug(f"Notificator: initialized")

    @staticmethod
    def create(message: str, title: str | None, additionalProperties: dict):
        logging.debug(f"Notificator: creating notification...")

        # Create the log item
        item = Notification(
            message=message,
            title=title,
            additionalProperties=additionalProperties
        )

        logging.debug(f"Notificator: notification item: {item}")

        # Send the log item to the log service

        message = {
            **item.to_dict()
        }

        logging.debug(f"Sending notification to message broker...")

        try:
            credentials = pika.PlainCredentials(RABBBITMQ_USER, RABBBITMQ_PASS)
            connection = pika.BlockingConnection(pika.ConnectionParameters(
                RABBBITMQ_HOST, RABBBITMQ_PORT, '/', credentials))
        except Exception:
            logging.exception(
                "Failed to connect to RabbitMQ service. Notification wont be sent.")
            raise GraphQLError("Error connecting to Notificator")

        channel = connection.channel()
        channel.queue_declare(queue='notification', durable=True)
        body = json.dumps(message)
        channel.basic_publish(
            exchange='',
            routing_key='notification',
            body=body,
            properties=pika.BasicProperties(
                delivery_mode=2,  # make message persistent
            ))
        connection.close()
        logging.debug(f"Notificator: notification sent to message broker")
