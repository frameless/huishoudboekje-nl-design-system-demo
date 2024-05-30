from datetime import datetime, timezone
import json
import logging
import time
import pika
from flask import g, request

from hhb_backend.alarm_evaluation.journal_entry_model import JournalEntryModel
from hhb_backend.alarm_evaluation.evaluation_message import CheckAlarmsReconciledMessage, CheckSaldosMessage
from hhb_backend.alarm_evaluation.settings import RABBBITMQ_HOST, RABBBITMQ_PASS, RABBBITMQ_PORT, RABBBITMQ_USER

from graphql import GraphQLError


class AlarmEvaluation:
    def __init__(self):
        logging.debug(f"AlarmEvaluation: initialized")

    @staticmethod
    def create(agreementToAlarms: dict[str, str], journalEntryToTransaction: dict, citizensToSaldoCheck: list[str], alarmToCitizen: dict[str, str], csmIdToUuid: dict, saldoThreshold: int = 0):
        logging.debug(f"AlarmEvaluation: creating message...")

        reconilliatedJournalEntries = []
        for journalentry, banktransaction in journalEntryToTransaction:
            amount = banktransaction["bedrag"]

            date = datetime.fromisoformat(
                banktransaction["transactie_datum"])
            date = date.replace(
                tzinfo=timezone.utc) if date.tzinfo is None else date.astimezone(timezone.utc)

            model = JournalEntryModel(
                UUID=journalentry["uuid"],
                AgreementUuid=journalentry["afspraak"]["uuid"],
                BankTransactionUuid=banktransaction["uuid"],
                Date=int(date.timestamp()),
                IsAutomaticallyReconciled=journalentry["is_automatisch_geboekt"],
                StatementUuid=csmIdToUuid[banktransaction["customer_statement_message_id"]],
                Amount=amount
            )
            reconilliatedJournalEntries.append(model.to_dict())


        checkAlarmsReconciledItem = CheckAlarmsReconciledMessage(
            AgreementToAlarm=agreementToAlarms,
            ReconciledJournalEntries=reconilliatedJournalEntries,
            AlarmToCitizen=alarmToCitizen,
        )

        checkSaldosItem = CheckSaldosMessage(
            AffectedCitizens=citizensToSaldoCheck,
            SaldoThreshold=saldoThreshold
        )

        try:
            credentials = pika.PlainCredentials(RABBBITMQ_USER, RABBBITMQ_PASS)
            connection = pika.BlockingConnection(pika.ConnectionParameters(
                RABBBITMQ_HOST, RABBBITMQ_PORT, '/', credentials))
        except Exception:
            logging.exception(
                "Failed to connect to RabbitMQ service. Alarm Evaluation wont be started.")
            raise GraphQLError("Error connecting to alarmservice")

        if checkAlarmsReconciledItem.AgreementToAlarm is not None and len(checkAlarmsReconciledItem.AgreementToAlarm) > 0 \
            and checkAlarmsReconciledItem.AlarmToCitizen is not None and len(checkAlarmsReconciledItem.AlarmToCitizen) > 0 \
            and checkAlarmsReconciledItem.ReconciledJournalEntries is not None and len(checkAlarmsReconciledItem.ReconciledJournalEntries) > 0:

            checkAlarmsReconciledMessage = {
                **checkAlarmsReconciledItem.to_dict()
            }

            logging.debug(f"Sending alarm evaluation request to message broker...")
            reconiledChannel = connection.channel()
            reconiledChannel.queue_declare(queue='check-alarms-reconiled', durable=True)
            reconiledBody = json.dumps(checkAlarmsReconciledMessage)
            reconiledChannel.basic_publish(
                exchange='',
                routing_key='check-alarms-reconiled',	
                body=reconiledBody,
                properties=pika.BasicProperties(
                    delivery_mode=2,  # make message persistent
                ))
            logging.info(f"AlarmEvaluation: alarm evaluation message send to message broker")

        if checkSaldosItem.AffectedCitizens is not None and len(checkSaldosItem.AffectedCitizens) > 0:    
            checkSaldosMessage = {
                **checkSaldosItem.to_dict()
            }
            logging.debug(f"Sending saldo evaluation request to message broker...")
            saldoChannel = connection.channel()
            saldoChannel.queue_declare(queue='check-saldos', durable=True)
            saldoBody = json.dumps(checkSaldosMessage)
            saldoChannel.basic_publish(
                exchange='',
                routing_key='check-saldos',	
                body=saldoBody,
                properties=pika.BasicProperties(
                    delivery_mode=2,  # make message persistent
                ))
            logging.info(f"AlarmEvaluation: saldo evaluation message send to message broker")
        
        connection.close()