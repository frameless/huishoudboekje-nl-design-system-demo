""" Test GET /banktransactions/range """
from datetime import date


def test_bank_transaction_get_range_no_json(client):
    """ Test /banktransactions/range path """
    response = client.get(f'/banktransactions/range?startDate=2019-01-20&endDate=2019-03-20')
    #I use an or here because different results local and pipeline. Both are valid responses to no json.
    assert response.status_code == 415 or response.status_code == 400

def test_bank_transaction_get_range_wrong_json(client):
    """ Test /banktransactions/range path """
    testBody = '{"transactions": [1,2,3]}'
    response = client.get(f'/banktransactions/range?startDate=2019-01-20&endDate=2019-03-20', data=testBody, content_type='application/json')
    assert response.status_code == 400

def test_bank_transaction_get_range_valdid_dates_with_ids(client, bank_transaction_factory):
    """ Test /banktransactions/range path """
    bank_transaction1 = bank_transaction_factory.createBankTransaction(transactie_datum = date(2019, 2, 10))
    testBody = '{"transaction_ids": [1,2,3]}'
    response = client.get(f'/banktransactions/range?startDate=2019-01-20&endDate=2019-03-20', data=testBody, content_type='application/json')
    assert response.status_code == 200
    assert len(response.json["data"]) == 1
    assert response.json["data"][0]["id"] == bank_transaction1.id

def test_bank_transaction_get_range_valdid_dates_with_ids_some_ids_outside_date_range(client, bank_transaction_factory):
    """ Test /banktransactions/range path """
    bank_transaction1 = bank_transaction_factory.createBankTransaction(transactie_datum = date(2019, 2, 10))
    bank_transaction2 = bank_transaction_factory.createBankTransaction(transactie_datum = date(2023, 2, 10))
    bank_transaction3 = bank_transaction_factory.createBankTransaction(transactie_datum = date(2019, 2, 10))
    testBody = '{"transaction_ids": [1,2,3]}'
    response = client.get(f'/banktransactions/range?startDate=2019-01-20&endDate=2019-03-20', data=testBody, content_type='application/json')
    assert response.status_code == 200
    assert len(response.json["data"]) == 2
    assert response.json["data"][0]["id"] == bank_transaction1.id
    assert response.json["data"][1]["id"] == bank_transaction3.id

    
def test_bank_transaction_get_range_valdid_dates_no_ids(client, bank_transaction_factory):
    """ Test /banktransactions/range path """
    bank_transaction1 = bank_transaction_factory.createBankTransaction(transactie_datum = date(2019, 2, 10))
    testBody = '{"transaction_ids": []}'
    response = client.get(f'/banktransactions/range?startDate=2019-01-20&endDate=2019-03-20', data=testBody, content_type='application/json')
    assert response.status_code == 200
    assert len(response.json["data"]) == 1
    assert response.json["data"][0]["transactie_datum"] == str(bank_transaction1.transactie_datum)

def test_bank_transaction_get_range_valdid_dates_outside_range_no_ids(client, bank_transaction_factory):
    """ Test /banktransactions/range path """
    bank_transaction1 = bank_transaction_factory.createBankTransaction(transactie_datum = date(2023, 2, 10))
    testBody = '{"transaction_ids": []}'
    response = client.get(f'/banktransactions/range?startDate=2019-01-20&endDate=2019-03-20', data=testBody, content_type='application/json')
    assert response.status_code == 200
    assert len(response.json["data"]) == 0

def test_bank_transaction_get_range_number_as_start_date(client,):
    """ Test /banktransactions/range path """
    testBody = '{"transaction_ids": []}'
    response = client.get(f'/banktransactions/range?startDate=12345&endDate=2019-03-20', data=testBody, content_type='application/json')
    assert response.status_code == 400

def test_bank_transaction_get_range_number_as_end_date(client):
    """ Test /banktransactions/range path """
    testBody = '{"transaction_ids": []}'
    response = client.get(f'/banktransactions/range?startDate=2019-03-20&endDate=12345',  data=testBody,content_type='application/json')
    assert response.status_code == 400

def test_bank_transaction_get_range_text_as_end_date(client):
    """ Test /banktransactions/range path """
    testBody = '{"transaction_ids": []}'
    response = client.get(f'/banktransactions/range?startDate=2019-03-20&endDate=abcdef',  data=testBody, content_type='application/json')
    assert response.status_code == 400

def test_bank_transaction_get_range_text_as_start_date(client):
    """ Test /banktransactions/range path """
    testBody = '{"transaction_ids": []}'
    response = client.get(f'/banktransactions/range?startDate=abcdseg&endDate=2019-03-20', data=testBody,content_type='application/json')
    assert response.status_code == 400

def test_bank_transaction_get_range_wrong_date_as_start_date(client):
    """ Test /banktransactions/range path """
    testBody = '{"transaction_ids": []}'
    response = client.get(f'/banktransactions/range?startDate=2023-02-30&endDate=2019-03-20', data=testBody,content_type='application/json')
    assert response.status_code == 400

def test_bank_transaction_get_range_wrong_date_as_end_date(client):
    """ Test /banktransactions/range path """
    testBody = '{"transaction_ids": []}'
    response = client.get(f'/banktransactions/range?startDate=2019-03-20&endDate=2023-02-30', data=testBody,content_type='application/json')
    assert response.status_code == 400

def test_bank_transaction_get_symbols_date_as_end_date(client):
    """ Test /banktransactions/range path """
    testBody = '{"transaction_ids": []}'
    response = client.get(f'/banktransactions/range?startDate=2019-03-20&endDate=!@#$%^&*',  data=testBody,content_type='application/json')
    assert response.status_code == 400

def test_bank_transaction_get_symbols_date_as_start_date(client):
    """ Test /banktransactions/range path """
    testBody = '{"transaction_ids": []}'
    response = client.get(f'/banktransactions/range?startDate=!@#$%^&&endDate=2019-03-20', data=testBody,content_type='application/json')
    assert response.status_code == 400

