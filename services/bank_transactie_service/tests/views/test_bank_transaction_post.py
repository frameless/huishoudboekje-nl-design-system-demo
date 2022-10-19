""" Test POST /banktransactions/(<banktransaction_id>/) """
import json
from models import BankTransaction


def test_banktransaction_post_new_csm(client, dbsession, csm_factory):
    """ Test /banktransactions/ path """
    csm = csm_factory.create_customer_statement_message()
    assert dbsession.query(BankTransaction).count() == 0
    bank_transaction_dict = {
        "customer_statement_message_id": csm.id,
        "statement_line": "DATA",
        "information_to_account_owner": "DESCRIPTION",
        "transactie_datum": "2020-01-01",
        "tegen_rekening": "NL02ABNA0123456789",
        "is_credit": 1,
        "bedrag": 100,
        "is_geboekt": True,
    }
    response = client.post(
        '/banktransactions/',
        data=json.dumps(bank_transaction_dict),
        content_type='application/json'
    )
    assert response.status_code == 201
    assert response.json["data"]["customer_statement_message_id"] == bank_transaction_dict["customer_statement_message_id"]
    assert response.json["data"]["statement_line"] == bank_transaction_dict["statement_line"]
    assert response.json["data"]["information_to_account_owner"] == bank_transaction_dict["information_to_account_owner"]
    assert response.json["data"]["transactie_datum"] == "2020-01-01T00:00:00"
    assert response.json["data"]["tegen_rekening"] == bank_transaction_dict["tegen_rekening"]
    assert response.json["data"]["is_credit"] is True
    assert response.json["data"]["bedrag"] == bank_transaction_dict["bedrag"]
    assert response.json["data"]["is_geboekt"] == bank_transaction_dict["is_geboekt"]
    assert dbsession.query(BankTransaction).count() == 1
