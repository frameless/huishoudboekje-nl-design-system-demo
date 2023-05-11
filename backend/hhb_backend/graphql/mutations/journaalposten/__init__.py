import logging
import requests
from typing import List, Union

from hhb_backend.graphql import settings
from hhb_backend.service.model.bank_transaction import BankTransaction


def update_transaction_service_is_geboekt(
    transactions: Union[List[BankTransaction], BankTransaction],
    is_geboekt: bool
):
    if type(transactions) is not list:
        transactions = [transactions]

    _transaction_ids = []
    for transaction in transactions:
        transaction.is_geboekt = is_geboekt
        _transaction_ids.append(str(transaction.id))

    update_transactions_geboekt(transactions, _transaction_ids)


def update_transactions_geboekt(transactions: List[BankTransaction], _transaction_ids):
    """ Sets the is_geboekt flag to true for all transactions """
    if len(transactions) == 1:
        ids = _transaction_ids[0]
        transactions = transactions[0]
    else:
        ids = ",".join(_transaction_ids)

    # TODO
    # The ids are all joined and added in the url. For large updates this makes the url very long.
    # In the Dockerfile for the banktransaction service is GUNICORN_LIMIT_REQUEST_LINE=0 added to set the limit for the url to unlimited.
    # This makes sure this works for larger updates, however this should not be necessary.
    transaction_response = requests.put(
        f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/{ids}",
        json=transactions
    )

    if not transaction_response.ok:
        logging.warning(
            f"Failed to save is_geboekt on transactions {_transaction_ids}: {transaction_response.text}")
