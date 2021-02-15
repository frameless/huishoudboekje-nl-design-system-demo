""" Test GET /banktransactions/(<banktransaction_id>/) """
from models.customer_statement_message import CustomerStatementMessage
from core_service.utils import row2dict
from tests.factories import customer_statement_message_factory


def test_bank_transaction_get_success_all(client, bank_transaction_factory):
    """ Test /banktransactions/(<bank_transaction_id>) path """
    bank_transaction1 = bank_transaction_factory.createBankTransaction(statement_line="stmt1")
    bank_transaction2 = bank_transaction_factory.createBankTransaction(statement_line="stmt2")
    response = client.get(f'/banktransactions/')
    assert response.status_code == 200
    assert len(response.json["data"]) == 2
    assert response.json["data"][0]["statement_line"] == bank_transaction1.statement_line
    assert response.json["data"][1]["statement_line"] == bank_transaction2.statement_line


def test_bank_transaction_get_success_one(client, bank_transaction_factory):
    """ Test /banktransactions/(<bank_transaction_id>) path """
    bank_transaction1 = bank_transaction_factory.createBankTransaction(statement_line="stmt1")
    response = client.get(f'/banktransactions/{bank_transaction1.id}')
    assert response.status_code == 200
    assert response.json["data"]["statement_line"] == bank_transaction1.statement_line


def test_bank_transaction_get_success_filter_csms(client, bank_transaction_factory):
    """ Test /banktransactions/(<bank_transaction_id>) path """
    bank_transaction1 = bank_transaction_factory.createBankTransaction(statement_line="stmt1")
    bank_transaction2 = bank_transaction_factory.createBankTransaction(statement_line="stmt1")
    assert bank_transaction1.customer_statement_message_id != bank_transaction2.customer_statement_message_id
    response = client.get(f'/banktransactions/?filter_csms={bank_transaction1.customer_statement_message_id}')
    assert response.status_code == 200
    assert len(response.json["data"]) == 1
    assert response.json["data"][0]["id"] == bank_transaction1.id


def test_bank_transaction_get_success_filter_is_geboekt(client, bank_transaction_factory):
    """ Test /banktransactions/(<bank_transaction_id>) path """
    bank_transaction1 = bank_transaction_factory.createBankTransaction(is_geboekt=None)
    bank_transaction2 = bank_transaction_factory.createBankTransaction(is_geboekt=False)
    bank_transaction3 = bank_transaction_factory.createBankTransaction(is_geboekt=True)

    response = client.get(f'/banktransactions/?filter_is_geboekt=false')
    assert response.status_code == 200
    assert len(response.json["data"]) == 2

    assert response.json["data"][0]["id"] == bank_transaction1.id
    assert response.json["data"][1]["id"] == bank_transaction2.id
    assert bank_transaction3.id not in [bt["id"] for bt in response.json["data"]]

    response = client.get(f'/banktransactions/?filter_is_geboekt=true')
    assert response.status_code == 200
    assert len(response.json["data"]) == 1
    assert response.json["data"][0]["id"] == bank_transaction3.id


def test_bank_transaction_get_success_filter_is_geboekt_and_csm(client, bank_transaction_factory, csm_factory):
    """ Test /banktransactions/(<bank_transaction_id>) path """
    csm1 = csm_factory.create_customer_statement_message()
    csm2 = csm_factory.create_customer_statement_message()
    bank_transaction11 = bank_transaction_factory.createBankTransaction(customer_statement_message_id=csm1.id,
                                                                        is_geboekt=None)
    bank_transaction12 = bank_transaction_factory.createBankTransaction(customer_statement_message_id=csm1.id,
                                                                        is_geboekt=None)
    bank_transaction13 = bank_transaction_factory.createBankTransaction(customer_statement_message_id=csm1.id,
                                                                        is_geboekt=True)
    bank_transaction21 = bank_transaction_factory.createBankTransaction(customer_statement_message_id=csm2.id,
                                                                        is_geboekt=None)

    response = client.get(f'/banktransactions/?filter_csms={csm1.id}&filter_is_geboekt=false')
    assert response.status_code == 200
    assert len(response.json["data"]) == 2

    assert response.json["data"][0]["id"] == bank_transaction11.id
    assert response.json["data"][1]["id"] == bank_transaction12.id

    assert bank_transaction13.id not in [bt["id"] for bt in response.json["data"]]
    assert bank_transaction21.id not in [bt["id"] for bt in response.json["data"]]
