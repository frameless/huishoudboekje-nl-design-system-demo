""" Test DELETE /customerstatementmessages/(<customerstatementmessage_id>/) """
from models.customer_statement_message import CustomerStatementMessage
from models.bank_transaction import BankTransaction


def test_csm_delete_success(client, dbsession, csm_factory):
    """ Test a succesfull DELETE on customerstatementmessage """
    csm = csm_factory.create_customer_statement_message()
    assert dbsession.query(CustomerStatementMessage).count() == 1
    response = client.delete(f'/customerstatementmessages/{csm.id}')
    assert response.status_code == 204
    assert dbsession.query(CustomerStatementMessage).count() == 0

def test_csm_delete_cascade_transaction(client, dbsession, csm_factory, bank_transaction_factory):
    csm = csm_factory.create_customer_statement_message()
    bank_transaction = bank_transaction_factory.createBankTransaction(customer_statement_message_id=csm.id)
    assert dbsession.query(CustomerStatementMessage).count() == 1
    assert dbsession.query(BankTransaction).count() == 1
    response = client.delete(f'/customerstatementmessages/{csm.id}')
    assert response.status_code == 204
    assert dbsession.query(CustomerStatementMessage).count() == 0
    assert dbsession.query(BankTransaction).count() == 0

def test_csm_delete_bad_request(client):
    """ Test 400 error for DELETE on customerstatementmessage """
    response = client.delete('/customerstatementmessages/')
    assert response.status_code == 405


def test_csm_delete_csm_not_found(client):
    """ Test 404 error for DELETE on customerstatementmessages """
    response = client.delete('/customerstatementmessages/1337')
    assert response.status_code == 404
