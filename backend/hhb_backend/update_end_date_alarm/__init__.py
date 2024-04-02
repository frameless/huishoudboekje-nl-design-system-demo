from datetime import datetime
import json
import logging
import time
import pika
from flask import g, request

from hhb_backend.update_end_date_alarm.removal_message import UpdateEndDateAlarmMessage
from hhb_backend.alarm_evaluation.settings import RABBBITMQ_HOST, RABBBITMQ_PASS, RABBBITMQ_PORT, RABBBITMQ_USER

from graphql import GraphQLError


class UpdateEndDateAlarm:
    def __init__(self):
        logging.debug(f"UpdateEndDateAlarm: initialized")

    @staticmethod
    def create(alarmUuid: str, newEndDate: str):
        logging.debug(f"UpdateEndDateAlarm: creating message...")

        item = UpdateEndDateAlarmMessage(
            AlarmUuid=alarmUuid,
            EndDateUnix=int(datetime.strptime(newEndDate, '%Y-%m-%d').timestamp())
        )

        message = {
            **item.to_dict()
        }

        logging.debug(
            f"Sending UpdateEndDateAlarmMessage request to message broker...")

        try:
            credentials = pika.PlainCredentials(RABBBITMQ_USER, RABBBITMQ_PASS)
            connection = pika.BlockingConnection(pika.ConnectionParameters(
                RABBBITMQ_HOST, RABBBITMQ_PORT, '/', credentials))
        except Exception:
            logging.exception(
                "Failed to connect to RabbitMQ service.UpdateEndDateAlarmMessage wont be started.")
            raise GraphQLError("Error connecting to alarmservice")

        channel = connection.channel()
        channel.queue_declare(
            queue='update-end-date-alarm', durable=True)
        body = json.dumps(message)
        channel.basic_publish(
            exchange='',
            routing_key='update-end-date-alarm',
            body=body,
            properties=pika.BasicProperties(
                delivery_mode=2,  # make message persistent
            ))
        connection.close()
        logging.debug(
            f"UpdateEndDateAlarm: message send to message broker")
