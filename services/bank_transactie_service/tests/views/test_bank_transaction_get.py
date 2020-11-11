""" Test GET /banktransactions/(<banktransaction_id>/) """
from models.customer_statement_message import CustomerStatementMessage
from core_service.utils import row2dict


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