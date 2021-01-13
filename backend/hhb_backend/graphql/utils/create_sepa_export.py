from sepaxml import SepaTransfer


def create_export_string(overschrijvingen, afspraken, tegen_rekeningen, config_values):
    config = {
        "name": "Huishoudboekje " + config_values['gemeente_naam'],
        "IBAN": config_values["gemeente_iban"],
        "BIC": config_values["gemeente_bic"],
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
            "execution_date": overschrijving['datum'],
            "description": afspraak['beschrijving'],
            # "endtoend_id": str(uuid.uuid1())  # optional
        }
        sepa.add_payment(payment)

    return sepa.export(validate=True)
