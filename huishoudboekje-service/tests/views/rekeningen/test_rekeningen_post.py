""" Test POST /rekeningen/(<rekening_id>/) """
import json
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
    assert response.json["data"] == rekening_dict
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
    assert response.status_code == 202
    update_dict["id"] = rekening.id
    assert response.json["data"]["rekeninghouder"] == update_dict["rekeninghouder"]
    response = client.post(
        f'/rekeningen/1337',
        data=json.dumps(update_dict),
        content_type='application/json'
    )
    assert response.status_code == 404


