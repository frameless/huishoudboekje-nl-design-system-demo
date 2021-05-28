import logging

import requests

from hhb_backend.graphql import settings


def update_transaction_service_is_geboekt(transactions, is_geboekt: bool):
    if type(transactions) == list:
        for t in transactions:
            data = {**t, "is_geboekt": is_geboekt}
            transaction_ids = str(t["id"])
            process_transaction(transaction_ids, data)
    else:
        data = {**transactions, "is_geboekt": is_geboekt}
        transaction_ids = str(transactions["id"])
        process_transaction(transaction_ids, data)


def process_transaction(transaction_ids, data):
    transaction_response = requests.post(
        f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/{transaction_ids}",
        json=data
    )
    if not transaction_response.ok:
        logging.warning(
            f"Failed to save is_geboekt on transaction(s) {transaction_ids}: {transaction_response.text}")


