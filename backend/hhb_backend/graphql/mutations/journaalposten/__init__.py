import logging
from typing import List, Union

import requests

from hhb_backend.graphql import settings
from hhb_backend.service.model.bank_transaction import BankTransaction


def update_transaction_service_is_geboekt(transactions: Union[List[BankTransaction], BankTransaction],
                                          is_geboekt: bool):
    if type(transactions) is not list:
        transactions = [transactions]

    for transaction in transactions:
        transaction.is_geboekt = is_geboekt
        process_transaction(transaction)


def process_transaction(transaction: BankTransaction):
    transaction_response = requests.post(
        f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/{transaction.id}",
        json=transaction
    )
    if not transaction_response.ok:
        logging.warning(
            f"Failed to save is_geboekt on transaction {transaction.id}: {transaction_response.text}")


