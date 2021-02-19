import logging

import requests

from hhb_backend.graphql import settings


def update_transaction_service_is_geboekt(transactions, is_geboekt: bool):
    if type(transactions) == list:
        data = [{**t, "is_geboekt": is_geboekt} for t in transactions]
        transaction_ids = ",".join([str(t["id"]) for t in transactions])
    else:
        data = {**transactions, "is_geboekt": is_geboekt}
        transaction_ids = str(transactions["id"])

    transaction_response = requests.post(
        f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/{transaction_ids}",
        json=data
    )
    if not transaction_response.ok:
        logging.warning(
            f"Failed to save is_geboekt on transaction(s) {transaction_ids}: {transaction_response.text}")
