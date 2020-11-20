""" Test POST /journaalposten/(<journaalpost_id>/) """
import json
from datetime import date
import pytest
from models.journaalpost import Journaalpost

def test_journaalposten_post_new_journaalpost(client, session):
    """ Test /journaalposten/ path """
    assert session.query(Journaalpost).count() == 0
    journaalpost_dict = {
        "transaction_id": 1,
        "grootboekrekening_id": "BTes",
    }
    response = client.post(
        '/journaalposten/',
        data=json.dumps(journaalpost_dict),
        content_type='application/json'
    )
    assert response.status_code == 201
    assert response.json["data"]["transaction_id"] == 1
    assert response.json["data"]["grootboekrekening_id"] == "BTes"
    assert session.query(Journaalpost).count() == 1

def test_journaalposten_post_update_journaalpost(client, session, journaalpost_factory):
    """ Test /journaalposten/<journaalpost_id> path """
    journaalpost = journaalpost_factory.create_journaalpost(transaction_id=1, grootboekrekening_id="Test")
    update_dict = {
        "transaction_id": 1337,
        "grootboekrekening_id": "Updated"
    }
    response = client.post(
        f'/journaalposten/{journaalpost.id}',
        data=json.dumps(update_dict),
        content_type='application/json'
    )
    assert response.status_code == 200
    assert response.json["data"]["transaction_id"] == update_dict["transaction_id"] == journaalpost.transaction_id
    assert response.json["data"]["grootboekrekening_id"] == update_dict["grootboekrekening_id"] == journaalpost.grootboekrekening_id
    response = client.post(
        f'/journaalposten/1337',
        data=json.dumps(update_dict),
        content_type='application/json'
    )
    assert response.status_code == 404

@pytest.mark.parametrize("key,bad_value", [
    ("transaction_id", "Kareltje"),
    ("grootboekrekening_id", 1234),
    ("afspraak_id", "Kareltje"),
])
def test_journaalposten_post_bad_requests(client, key, bad_value):
    """ Test /journaalposten/ path bad request """
    bad_data = {key: bad_value}
    response = client.post(
        f'/journaalposten/',
        data=json.dumps(bad_data),
        content_type='application/json'
    )
    assert response.status_code == 400
