""" Test DELETE /customerstatementmessages/(<customerstatementmessage_id>/) """
from models import BankTransaction


def test_bank_transaction_delete_success(client, dbsession, bank_transaction_factory):
    """ Test a succesfull DELETE on banktransaction """
    bank_transaction = bank_transaction_factory.createBankTransaction()
    assert dbsession.query(BankTransaction).count() == 1
    response = client.delete(f'/banktransaction/{bank_transaction.id}')
    assert response.status_code == 204
    assert dbsession.query(BankTransaction).count() == 0


def test_bank_transaction_delete_bad_request(client):
    """ Test 405 error for DELETE on bank_transaction """
    response = client.delete('/banktransaction/')
    assert response.status_code == 405


def test_bank_transaction_delete_csm_not_found(client):
    """ Test 404 error for DELETE on bank_transaction """
    response = client.delete('/banktransaction/1337')
    assert response.status_code == 404
