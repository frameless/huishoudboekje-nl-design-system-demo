""" Test POST /customerstatementmessages/(<customerstatementmessage_id>/) """
import json
from models import BankTransaction


def test_csm_post_new_csm(client, dbsession, csm_factory):
    """ Test /banktransaction/ path """
    csm = csm_factory.create_customer_statement_message()
    assert dbsession.query(BankTransaction).count() == 0
    bank_transaction_dict = {
        "customer_statement_message_id": csm.id,
        "statement_line": "DATA",
        "information_to_account_owner": "DESCRIPTION"
    }
    response = client.post(
        '/banktransaction/',
        data=json.dumps(bank_transaction_dict),
        content_type='application/json'
    )
    assert response.status_code == 201
    assert response.json["data"]["customer_statement_message_id"] == bank_transaction_dict["customer_statement_message_id"]
    assert response.json["data"]["statement_line"] == bank_transaction_dict["statement_line"]
    assert response.json["data"]["information_to_account_owner"] == bank_transaction_dict["information_to_account_owner"]
    assert dbsession.query(BankTransaction).count() == 1
