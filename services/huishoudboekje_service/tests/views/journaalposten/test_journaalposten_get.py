""" Test GET /journaalposten/(<journaalpost_id>/) """
from models.journaalpost import Journaalpost

def test_journaalpost_get_success_multiple(client, journaalpost_factory):
    """ Test /journaalposten/ path """
    journaalpost1 = journaalpost_factory.create_journaalpost(grootboekrekening_id="Journaalpost1")
    journaalpost2 = journaalpost_factory.create_journaalpost(grootboekrekening_id="Journaalpost2")
    response = client.get(f'/journaalposten/')
    assert response.status_code == 200
    assert len(response.json["data"]) == 2
    assert response.json["data"][0]["grootboekrekening_id"] == journaalpost1.grootboekrekening_id
    assert response.json["data"][1]["grootboekrekening_id"] == journaalpost2.grootboekrekening_id

def test_journaalpost_get_success_single(client, journaalpost_factory):
    """ Test /journaalposten/ path """
    journaalpost1 = journaalpost_factory.create_journaalpost(grootboekrekening_id="Journaalpost1")
    journaalpost2 = journaalpost_factory.create_journaalpost(grootboekrekening_id="Journaalpost2")
    response = client.get(f'/journaalposten/{journaalpost2.id}')
    assert response.status_code == 200
    assert response.json["data"]["grootboekrekening_id"] == journaalpost2.grootboekrekening_id

def test_journaalpost_get_failure_not_found(client):
    response = client.get('/journaalposten/1337')
    assert response.status_code == 404
    assert response.json["errors"][0] == "Journaalpost not found."

def test_journaalpost_filter_columns(client, journaalpost_factory):
    journaalpost1 = journaalpost_factory.create_journaalpost(grootboekrekening_id="Journaalpost1")
    journaalpost2 = journaalpost_factory.create_journaalpost(grootboekrekening_id="Journaalpost2")
    response = client.get('/journaalposten/?columns=id,grootboekrekening_id')
    assert response.status_code == 200
    assert response.json["data"] == [
        {"id": journaalpost1.id, "grootboekrekening_id": journaalpost1.grootboekrekening_id},
        {"id": journaalpost2.id, "grootboekrekening_id": journaalpost2.grootboekrekening_id}
    ]
    response = client.get(f'/journaalposten/{journaalpost2.id}?columns=id,grootboekrekening_id')
    assert response.status_code == 200
    assert response.json["data"] == {"id": journaalpost2.id, "grootboekrekening_id": journaalpost2.grootboekrekening_id}

def test_journaalpost_filter_invalid_column(client):
    response = client.get('/journaalposten/?columns=non-field')
    assert response.status_code == 400
    assert response.json["errors"][0] == "Input for columns is not correct, 'non-field' is not a column."

def test_journaalpost_filter_ids(client, journaalpost_factory):
    journaalpost1 = journaalpost_factory.create_journaalpost(grootboekrekening_id="Journaalpost1")
    journaalpost2 = journaalpost_factory.create_journaalpost(grootboekrekening_id="Journaalpost2")
    response = client.get(f'/journaalposten/?filter_ids={journaalpost1.id},{journaalpost2.id}')
    assert response.status_code == 200
    assert len(response.json["data"]) == 2
    assert response.json["data"][0]["grootboekrekening_id"] == journaalpost1.grootboekrekening_id
    assert response.json["data"][1]["grootboekrekening_id"] == journaalpost2.grootboekrekening_id
    response = client.get(f'/journaalposten/?filter_ids={journaalpost1.id}')
    assert response.status_code == 200
    assert len(response.json["data"]) == 1
    assert response.json["data"][0]["grootboekrekening_id"] == journaalpost1.grootboekrekening_id
    response = client.get(f'/journaalposten/?filter_ids={journaalpost2.id}')
    assert response.status_code == 200
    assert len(response.json["data"]) == 1
    assert response.json["data"][0]["grootboekrekening_id"] == journaalpost2.grootboekrekening_id

def test_journaalpost_filter_invalid_id(client):
    response = client.get(f'/journaalposten/?filter_ids=NaN')
    assert response.status_code == 400
    assert response.json["errors"][0] == "Input for filter_ids is not correct, 'NaN' is not a number."

