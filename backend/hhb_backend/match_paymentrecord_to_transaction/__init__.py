from datetime import datetime, timezone
import json
import logging
import time
import pika
from flask import g, request

from hhb_backend.match_paymentrecord_to_transaction.settings import RABBBITMQ_HOST, RABBBITMQ_PASS, RABBBITMQ_PORT, RABBBITMQ_USER
from hhb_backend.match_paymentrecord_to_transaction.match_transaction_to_record import MatchTransactionToRecordMessage, MinimalJournalEntry

from graphql import GraphQLError


class MatchJournalentriesToPaymentRecordsProducer:
    def __init__(self):
        logging.debug("created transaction match producer")

    @staticmethod
    def create(journalEntries: list[dict]):
        try:
            credentials = pika.PlainCredentials(RABBBITMQ_USER, RABBBITMQ_PASS)
            connection = pika.BlockingConnection(pika.ConnectionParameters(
                RABBBITMQ_HOST, RABBBITMQ_PORT, '/', credentials))
        except Exception:
            logging.exception(
                "Failed to connect to RabbitMQ service. Deletion wont be started.")
            raise GraphQLError("Error connecting to bankservice")

        transactionInfo = []
        for journalentry, banktransaction in journalEntries:

            date = datetime.fromisoformat(
                banktransaction["transactie_datum"])
            date = date.replace(
                tzinfo=timezone.utc) if date.tzinfo is None else date.astimezone(timezone.utc)

            model = MinimalJournalEntry(
                UUID=journalentry["uuid"],
                Date=int(date.timestamp()),
                Amount=banktransaction["bedrag"],
                AgreementUuid=journalentry["afspraak"]["uuid"],
                BankTransactionUuid=journalentry["transaction_uuid"],
                IsAutomaticallyReconciled=journalentry["is_automatisch_geboekt"],
            )

            transactionInfo.append(model)

        matchMessage = MatchTransactionToRecordMessage(
            TransactionInfo=transactionInfo
        )

        # try:
        reconiledChannel = connection.channel()
        reconiledChannel.queue_declare(
            queue='match-transaction-to-payment-record', durable=True)
        reconiledBody = json.dumps(matchMessage.to_dict())
        reconiledChannel.basic_publish(
            exchange='',
            routing_key='match-transaction-to-payment-record',
            body=reconiledBody,
            properties=pika.BasicProperties(
                delivery_mode=2,  # make message persistent
            ))
        # except Exception:
        #     logging.warn()
        #     logging.exception(
        #         "Failed to send message. Paymentrecords will not be matched to transactions")
        #     raise GraphQLError("Error connecting to bankservice")

        connection.close()
