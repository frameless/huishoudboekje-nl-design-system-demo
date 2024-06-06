from datetime import datetime, timezone
import json
import logging
import time
import pika
from flask import g, request

from hhb_backend.delete_alarms_producer.settings import RABBBITMQ_HOST, RABBBITMQ_PASS, RABBBITMQ_PORT, RABBBITMQ_USER
from hhb_backend.delete_alarms_producer.delete_alarms_message import DeleteAlarms

from graphql import GraphQLError


class DeleteAlarmsProducer:
    def __init__(self):
        logging.debug("created alarm deletion producer")

    @staticmethod
    def create(alarm_ids: list[str], citizen_ids: list[str], deleteSignals: bool = True):
        try:
            credentials = pika.PlainCredentials(RABBBITMQ_USER, RABBBITMQ_PASS)
            connection = pika.BlockingConnection(pika.ConnectionParameters(
                RABBBITMQ_HOST, RABBBITMQ_PORT, '/', credentials))
        except Exception:
            logging.exception(
                "Failed to connect to RabbitMQ service. Deletion wont be started.")
            raise GraphQLError("Error connecting to alarmservice")

        deleteMessage = DeleteAlarms(
            Ids=alarm_ids,
            DeleteSignals=deleteSignals,
            CitizenIds=citizen_ids
        )

        try:
            reconiledChannel = connection.channel()
            reconiledChannel.queue_declare(
                queue='delete-alarms', durable=True)
            reconiledBody = json.dumps(deleteMessage.to_dict())
            reconiledChannel.basic_publish(
                exchange='',
                routing_key='delete-alarms',
                body=reconiledBody,
                properties=pika.BasicProperties(
                    delivery_mode=2,  # make message persistent
                ))
        except Exception:
            logging.exception(
                "Failed to send message. Deletion wont be started.")
            raise GraphQLError("Error connecting to alarmservice")

        connection.close()
