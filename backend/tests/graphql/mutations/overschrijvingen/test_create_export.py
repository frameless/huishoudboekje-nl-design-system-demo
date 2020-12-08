from sepaxml import SepaDD, SepaTransfer
import datetime, uuid


def test_create_csm_with_ing_file(client):
    config = {
        "name": "Test von Testenstein",
        "IBAN": "NL50BANK1234567890",
        "BIC": "BANKNL2A",
        "batch": True,
        "currency": "EUR",  # ISO 4217
    }
    sepa = SepaTransfer(config, clean=True)

    payment = {
        "name": "Test von Testenstein",
        "IBAN": "NL50BANK1234567890",
        "BIC": "BANKNL2A",
        "amount": 5000,  # in cents
        "execution_date": datetime.date.today(),
        "description": "Test transaction",
        # "endtoend_id": str(uuid.uuid1())  # optional
    }
    sepa.add_payment(payment)

    print(sepa.export(validate=True))
