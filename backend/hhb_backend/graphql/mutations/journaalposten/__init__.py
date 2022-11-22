import logging
from typing import List, Union

import requests

from hhb_backend.graphql import settings
from hhb_backend.service.model.bank_transaction import BankTransaction


def update_transaction_service_is_geboekt(transactions: Union[List[BankTransaction], BankTransaction],
                                          is_geboekt: bool):
    if type(transactions) is not list:
        transactions = [transactions]

    _transaction_ids = []
    for transaction in transactions:
        transaction.is_geboekt = is_geboekt
        _transaction_ids.append(str(transaction.id))
        
    process_transaction(transactions, _transaction_ids)


def update_transactions_geboekt(transactions: List[BankTransaction], _transaction_ids):
    """ Sets the is_geboekt flag to true for all transactions """
    if len(transactions) == 1:
        ids = _transaction_ids[0]
        transactions = transactions[0]
    else:
        ids = ",".join(_transaction_ids)

    transaction_response = requests.post(
        f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/{ids}",
        json=transactions
    )
    if not transaction_response.ok:
        logging.warning(
            f"Failed to save is_geboekt on transactions {_transaction_ids}: {transaction_response.text}")


