from datetime import datetime

import requests
from graphql import GraphQLError
from sepaxml import SepaTransfer

from hhb_backend.graphql import settings


def create_export_string(overschrijvingen, export) -> str:
    config = {
        "name": "Huishoudboekje " + get_config_value("gemeente_naam"),
        "IBAN": get_config_value("gemeente_iban"),
        "BIC": get_config_value("gemeente_bic"),
        "batch": True,
        "currency": "EUR",  # ISO 4217
    }
    sepa = SepaTransfer(config, clean=True)

    for overschrijving in overschrijvingen:
        payment = {
            "name": overschrijving["rekenhouder"],
            "IBAN": overschrijving["iban"],
            "BIC": "BANKNL2A", # TODO nodig??
            "amount": overschrijving['bedrag'],
            "execution_date": overschrijving['datum'],
            "description": overschrijving['beschrijving'],
            # "endtoend_id": str(uuid.uuid1())  # optional
        }
        sepa.add_payment(payment)

    return sepa.export(validate=True)


def get_config_value(config_id) -> str:
    config_response = requests.get(
        f"{settings.HHB_SERVICES_URL}/configuratie/{config_id}",
        headers={'Content-type': 'application/json'}
    )
    if config_response.status_code != 200:
        raise GraphQLError(f"Upstream API responded: {config_response.json()}")
    return config_response.json()['data']['waarde']
