""" Test POST /rubrieken/(<rubriek_id>/) """
import json

from models import Rubriek


def test_rubrieken_post_new_rubriek(client, session):
    """ Test /rubrieken/ path """
    assert session.query(Rubriek).count() == 0
    rubriek_dict = {
        "naam": "Gas",
        "grootboekrekening_id": "WBedHuiGweGas"
    }
    response = client.post(
        '/rubrieken/',
        data=json.dumps(rubriek_dict),
        content_type='application/json'
    )
    assert response.status_code == 201
    rubriek_dict["id"] = 1
    assert response.json["data"] == rubriek_dict
    assert session.query(Rubriek).count() == 1


def test_rubrieken_post_unique_409(client, session):
    """ Test /rubrieken/ path """
    assert session.query(Rubriek).count() == 0
    rubriek_dict = {
        "naam": "Gas",
        "grootboekrekening_id": "WBedHuiGweGas"
    }
    response = client.post(
        '/rubrieken/',
        data=json.dumps(rubriek_dict),
        content_type='application/json'
    )
    assert response.status_code == 201
    rubriek_dict["id"] = 1
    assert response.json["data"] == rubriek_dict
    assert session.query(Rubriek).count() == 1
    rubriek_dict = {
        "naam": "Gas2",
        "grootboekrekening_id": "WBedHuiGweGas"
    }

    response = client.post(
        '/rubrieken/',
        data=json.dumps(rubriek_dict),
        content_type='application/json'
    )
    assert response.status_code == 409
    assert response.json["errors"][0] == 'Key (grootboekrekening_id)=(WBedHuiGweGas) already exists.'
