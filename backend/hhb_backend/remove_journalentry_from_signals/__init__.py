from datetime import datetime
import json
import logging
import time
import pika
from flask import g, request

from hhb_backend.remove_journalentry_from_signals.removal_message import RemoveJournalEntryFromSignalMessage
from hhb_backend.alarm_evaluation.settings import RABBBITMQ_HOST, RABBBITMQ_PASS, RABBBITMQ_PORT, RABBBITMQ_USER

from graphql import GraphQLError


class RemoveJournalEntryFromSignals:
    def __init__(self):
        logging.debug(f"RemoveJournalEntryFromSignals: initialized")

    @staticmethod
    def create(journalEntriesToRemove: list[str]):
        logging.debug(f"RemoveJournalEntryFromSignals: creating message...")

        item = RemoveJournalEntryFromSignalMessage(
            JournalEntryIds=journalEntriesToRemove
        )

        message = {
            **item.to_dict()
        }

        logging.debug(
            f"Sending RemoveJournalEntryFromSignalsMessage request to message broker...")

        try:
            credentials = pika.PlainCredentials(RABBBITMQ_USER, RABBBITMQ_PASS)
            connection = pika.BlockingConnection(pika.ConnectionParameters(
                RABBBITMQ_HOST, RABBBITMQ_PORT, '/', credentials))
        except Exception:
            logging.exception(
                "Failed to connect to RabbitMQ service.RemoveJournalEntryFromSignalsMessage wont be started.")
            raise GraphQLError("Error connecting to alarmservice")

        channel = connection.channel()
        channel.queue_declare(
            queue='remove-journal-entry-from-signals', durable=True)
        body = json.dumps(message)
        channel.basic_publish(
            exchange='',
            routing_key='remove-journal-entry-from-signals',
            body=body,
            properties=pika.BasicProperties(
                delivery_mode=2,  # make message persistent
            ))
        connection.close()
        logging.debug(
            f"RemoveJournalEntryFromSignalsMessage: message send to message broker")
