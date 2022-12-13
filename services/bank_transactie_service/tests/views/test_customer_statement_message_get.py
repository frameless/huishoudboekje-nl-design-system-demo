""" Test GET /customerstatementmessages/(<customerstatementmessage_id>/) """

def test_csm_get_success_all(client, csm_factory):
    """ Test /customerstatementmessages/ path """
    csm1 = csm_factory.create_customer_statement_message(opening_balance=1337)
    csm2 = csm_factory.create_customer_statement_message(opening_balance=8282)
    response = client.get(f'/customerstatementmessages/')
    assert response.status_code == 200
    assert len(response.json["data"]) == 2
    assert response.json["data"][0]["opening_balance"] == csm1.opening_balance == 1337
    assert response.json["data"][1]["opening_balance"] == csm2.opening_balance == 8282

# This relation doesn't exist anymore. Test disabled. (09-12-2022)
# def test_csm_get_success_resolve_bank_transactions(client, csm_factory, bank_transaction_factory):
#     """ Test /customerstatementmessages/ path """
#     csm = csm_factory.create_customer_statement_message()
#     bank_transaction = bank_transaction_factory.createBankTransaction(customer_statement_message_id=csm.id)
#     response = client.get(f'/customerstatementmessages/')
#     assert response.status_code == 200
#     assert len(response.json["data"]) == 1
#     assert len(response.json["data"][0]["bank_transactions"]) == 1
#     assert response.json["data"][0]["bank_transactions"][0] == bank_transaction.id
