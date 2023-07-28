""" Test POST /rekeningen/(<rekening_id>/) """
import json
from string import ascii_letters
from random import choice

from models.rekening import Rekening


def test_rekeningen_post_new_rekening(client, session):
    """ Test /rekeningen/ path """
    assert session.query(Rekening).count() == 0
    rekening_dict = {
        "iban": "GB33BUKB20201555555555",
        "rekeninghouder": "C. Lown"
    }
    response = client.post(
        '/rekeningen/',
        data=json.dumps(rekening_dict),
        content_type='application/json'
    )
    assert response.status_code == 201
    rekening_dict["id"] = 1
    responseJson = response.json["data"]
    responseJson.pop('uuid')

    assert responseJson == rekening_dict
    assert session.query(Rekening).count() == 1


def test_rekeningen_post_update_rekening(client, session, rekening_factory):
    """ Test /rekeningen/<rekening_id> path """
    rekening = rekening_factory.create_rekening()
    update_dict = {
        "rekeninghouder": "S. Jansen"
    }
    response = client.post(
        f'/rekeningen/{rekening.id}',
        data=json.dumps(update_dict),
        content_type='application/json'
    )
    assert response.status_code == 200
    update_dict["id"] = rekening.id
    assert response.json["data"]["rekeninghouder"] == update_dict["rekeninghouder"]
    response = client.post(
        f'/rekeningen/1337',
        data=json.dumps(update_dict),
        content_type='application/json'
    )
    assert response.status_code == 404


def test_rekeningen_post_update_rekening_max_rekeninghouder_length(client, session, rekening_factory):
    rekening = rekening_factory.create_rekening()

    too_long_rekeninghouder_name = ''.join(choice(ascii_letters) for _ in range(Rekening.get_max_rekeninghouder_length() + 1))

    update_dict = {
        "rekeninghouder": too_long_rekeninghouder_name
    }
    response = client.post(
        f'/rekeningen/{rekening.id}',
        data=json.dumps(update_dict),
        content_type='application/json'
    )
    assert response.status_code == 400
    assert 'is too long' in response.json['errors'][0]


