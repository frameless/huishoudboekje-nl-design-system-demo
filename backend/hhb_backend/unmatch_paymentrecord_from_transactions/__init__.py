from datetime import datetime
import json
import logging
import time
import pika
from flask import g, request

from hhb_backend.unmatch_paymentrecord_from_transactions.removal_message import UnMatchPaymentRecordsFromTransactionsMessage
from hhb_backend.unmatch_paymentrecord_from_transactions.settings import RABBBITMQ_HOST, RABBBITMQ_PASS, RABBBITMQ_PORT, RABBBITMQ_USER

from graphql import GraphQLError


class UnMatchPaymentRecordsFromTransactions:
    def __init__(self):
        logging.debug(f"UnMatchPaymentRecordsFromTransactions: initialized")

    @staticmethod
    def create(transactionids: list[str]):
        logging.debug(
            f"UnMatchPaymentRecordsFromTransactions: creating message...")

        item = UnMatchPaymentRecordsFromTransactionsMessage(
            TransactionIds=transactionids
        )

        message = {
            **item.to_dict()
        }

        logging.debug(
            f"Sending UnMatchPaymentRecordsFromTransactions request to message broker...")

        try:
            credentials = pika.PlainCredentials(RABBBITMQ_USER, RABBBITMQ_PASS)
            connection = pika.BlockingConnection(pika.ConnectionParameters(
                RABBBITMQ_HOST, RABBBITMQ_PORT, '/', credentials))
        except Exception:
            logging.exception(
                "Failed to connect to RabbitMQ service.UnMatchPaymentRecordsFromTransactions wont be started.")
            raise GraphQLError("Error connecting to bankservice")

        channel = connection.channel()
        channel.queue_declare(
            queue='un-match-transaction-to-payment-record', durable=True)
        body = json.dumps(message)
        channel.basic_publish(
            exchange='',
            routing_key='un-match-transaction-to-payment-record',
            body=body,
            properties=pika.BasicProperties(
                delivery_mode=2,  # make message persistent
            ))
        connection.close()
        logging.debug(
            f"UnMatchPaymentRecordsFromTransactions: message send to message broker")
