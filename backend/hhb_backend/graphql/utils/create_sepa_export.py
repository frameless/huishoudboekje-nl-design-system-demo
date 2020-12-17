import requests
from graphql import GraphQLError
from sepaxml import SepaTransfer
from datetime import datetime

from hhb_backend.graphql import settings


def create_export_string(overschrijvingen, afspraken, tegen_rekeningen):
    config = {
        "name": "Huishoudboekje " + get_config_value("gemeente_naam"),
        "IBAN": get_config_value("gemeente_iban"),
        "BIC": get_config_value("gemeente_bic"),
        "batch": False,
        "currency": "EUR",  # ISO 4217
    }
    sepa = SepaTransfer(config, clean=True)

    for overschrijving in overschrijvingen:
        afspraak = next(filter(lambda x: x['id'] == overschrijving['afspraak_id'], afspraken), None)
        tegen_rekening = next(filter(lambda x: x['id'] == afspraak['tegen_rekening_id'], tegen_rekeningen), None)
        payment = {
            "name": tegen_rekening["rekeninghouder"],
            "IBAN": tegen_rekening["iban"],
            # "BIC": "BANKNL2A", # TODO nodig??
            "amount": overschrijving['bedrag'],
            "execution_date": datetime.strptime(overschrijving['datum'], '%Y-%m-%d').date(),
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
