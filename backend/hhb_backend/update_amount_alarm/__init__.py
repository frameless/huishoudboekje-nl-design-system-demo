from datetime import datetime
import json
import logging
import time
import pika
from flask import g, request

from hhb_backend.update_amount_alarm.removal_message import UpdateAmountAlarmMessage
from hhb_backend.update_amount_alarm.settings import RABBBITMQ_HOST, RABBBITMQ_PASS, RABBBITMQ_PORT, RABBBITMQ_USER

from graphql import GraphQLError


class UpdateAmountAlarm:
    def __init__(self):
        logging.debug(f"UpdateAmountAlarm: initialized")

    @staticmethod
    def create(alarmUuid: str, amount: int):
        logging.debug(f"UpdateAmountAlarm: creating message...")

        item = UpdateAmountAlarmMessage(
            AlarmUuid=alarmUuid,
            Amount=amount
        )

        message = {
            **item.to_dict()
        }

        logging.debug(
            f"Sending UpdateAmountAlarm request to message broker...")

        try:
            credentials = pika.PlainCredentials(RABBBITMQ_USER, RABBBITMQ_PASS)
            connection = pika.BlockingConnection(pika.ConnectionParameters(
                RABBBITMQ_HOST, RABBBITMQ_PORT, '/', credentials))
        except Exception:
            logging.exception(
                "Failed to connect to RabbitMQ service.UpdateAmountAlarm wont be started.")
            raise GraphQLError("Error connecting to alarmservice")

        channel = connection.channel()
        channel.queue_declare(
            queue='update-alarm-amount', durable=True)
        body = json.dumps(message)
        channel.basic_publish(
            exchange='',
            routing_key='update-alarm-amount',
            body=body,
            properties=pika.BasicProperties(
                delivery_mode=2,  # make message persistent
            ))
        connection.close()
        logging.debug(
            f"UpdateAmountAlarm: message send to message broker")
