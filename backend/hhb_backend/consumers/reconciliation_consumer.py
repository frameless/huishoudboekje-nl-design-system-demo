import logging
from hhb_backend.consumers.base_consumer import BaseConsumer
from hhb_backend.processen.automatisch_boeken import automatisch_boeken


class ReconciliationConsumer(BaseConsumer):
    queue_name = "start-reconciliation"
    exchange = ''

    def consumer_action(self, message):
        ...
        csm_id = message.get("CustomerStatementMessageId", None)
        logging.info(f"Cosuming message: starting reconciliation csm:{csm_id}")
        automatisch_boeken(customer_statement_message_id=csm_id);
