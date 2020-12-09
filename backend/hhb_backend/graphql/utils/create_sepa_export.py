from datetime import datetime

import requests
from flask import request
from graphql import GraphQLError
from sepaxml import SepaTransfer

from hhb_backend.graphql import settings


def create_export_string(overschrijvingen, export) -> str:
    # TODO get overschrijvingen by export

    afspraken_ids = list(set([overschrijving['afspraak_id'] for overschrijving in overschrijvingen]))
    afspraken = await request.dataloader.afspraken_by_id.load_many(afspraken_ids)
    # Get all tegen_rekeningen
    tegen_rekeningen_ids = [afspraak_result['tegen_rekening_id'] for afspraak_result in afspraken]
    tegen_rekeningen = await request.dataloader.rekeningen_by_id.load_many(tegen_rekeningen_ids)

    config = {
        "name": "Huishoudboekje " + get_config_value("gemeente_naam"),
        "IBAN": get_config_value("gemeente_iban"),
        "BIC": get_config_value("gemeente_bic"),
        "batch": True,
        "currency": "EUR",  # ISO 4217
    }
    sepa = SepaTransfer(config, clean=True)

    for overschrijving in overschrijvingen:
        afspraak = next(filter(lambda x: x['id'] == overschrijving['id'], afspraken), None)
        tegen_rekening = next(filter(lambda x: x['id'] == afspraak['tegen_rekening_id'], tegen_rekeningen), None)
        payment = {
            "name": tegen_rekening["rekenhouder"],
            "IBAN": tegen_rekening["iban"],
            "BIC": "BANKNL2A", # TODO nodig??
            "amount": overschrijving['bedrag'],
            "execution_date": datetime.strptime(overschrijving['datum'], '%Y-%m-%d'),
            "description": afspraak['beschrijving'],
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
