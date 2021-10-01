""" Test POST /afdelingen/(<afdeling_id>/) """
import json
from models.afdeling import Afdeling


def test_afdelingen_post_new_organisation(client, dbsession):
    """ Test /afdelingen/ path """
    assert dbsession.query(Afdeling).count() == 0
    afdeling_dict = {
        "organisatie_id": 1,
        "naam": "testbedrijf"
    }
    response = client.post(
        '/afdelingen/',
        data=json.dumps(afdeling_dict),
        content_type='application/json'
    )
    assert response.status_code == 201
    assert response.json["data"]["organisatie_id"] == afdeling_dict["organisatie_id"]
    assert response.json["data"]["naam"] == afdeling_dict["naam"]
    assert dbsession.query(Afdeling).count() == 1


def test_afdelingen_post_update_afdeling(client, afdeling_factory):
    """ Test /afdelingen/<afdeling_id> path """
    afdeling = afdeling_factory.createafdeling(organisatie_id= 1)
    update_dict = {
        "naam": "testbedrijf"
    }
    response = client.post(
        f'/afdelingen/{afdeling.id}',
        data=json.dumps(update_dict),
        content_type='application/json'
    )
    assert response.status_code == 200
    assert response.json["data"]["naam"] == update_dict["naam"]
    assert response.json["data"] == afdeling.to_dict()
    response = client.post(
        f'/afdelingen/1337',
        data=json.dumps(update_dict),
        content_type='application/json'
    )
    assert response.status_code == 404


def test_afdelingen_post_bad_requests(client):
    """ Test /afdelingen/ path bad request """
    bad_data2 = {"naam": 12345}
    response = client.post(
        f'/afdelingen/',
        data=json.dumps(bad_data2),
        content_type='application/json'
    )
    assert response.status_code == 400
