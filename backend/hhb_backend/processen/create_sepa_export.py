import logging
from sepaxml import SepaTransfer
import uuid

from hhb_backend.graphql.utils.dates import to_date

def create_export_string(overschrijvingen, afspraken, tegen_rekeningen, config_values):
    config = {
        "name": "Huishoudboekje " + config_values['derdengeldenrekening_rekeninghouder'],
        "IBAN": config_values["derdengeldenrekening_iban"],
        "BIC": config_values["derdengeldenrekening_bic"],
        "batch": True,
        "currency": "EUR",  # ISO 4217
    }
    sepa = SepaTransfer(config, schema="pain.001.001.03", clean=True)

    for overschrijving in overschrijvingen:
        afspraak = next(filter(lambda x: x['id'] == overschrijving['afspraak_id'], afspraken), None)
        tegen_rekening = next(filter(lambda x: x['id'] == afspraak['tegen_rekening_id'], tegen_rekeningen), None)
        payment = {
            "name": tegen_rekening["rekeninghouder"],
            "IBAN": tegen_rekening["iban"],
            # "BIC": "BANKNL2A", # TODO nodig??
            "amount": overschrijving['bedrag'],
            "execution_date": to_date(overschrijving['datum']),
            "description": afspraak['omschrijving'],
            "endtoend_id": str(uuid.uuid1()).replace("-", ""),  # optional
        }
        sepa.add_payment(payment)

    sepaxmlstring = sepa.export(validate=True).decode()
    sepaxmlstring = sepaxmlstring.replace("<BtchBookg>true</BtchBookg>", "<BtchBookg>false</BtchBookg>")
    return sepaxmlstring
