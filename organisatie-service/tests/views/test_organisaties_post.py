""" Test POST /organisaties/(<organisatie_id>/) """
import json
from models.organisatie import Organisatie

def test_organisaties_post_new_organisation(client, dbsession):
    """ Test /organisaties/ path """
    assert dbsession.query(Organisatie).count() == 0
    organisatie_dict = {
        "kvk_nummer": 1,
        "naam": "testbedrijf"
    }
    response = client.post(
        '/organisaties/',
        data=json.dumps(organisatie_dict),
        content_type='application/json'
    )
    assert response.status_code == 201
    assert response.json["data"]["kvk_nummer"] == organisatie_dict["kvk_nummer"]
    assert response.json["data"]["naam"] == organisatie_dict["naam"]
    assert dbsession.query(Organisatie).count() == 1

def test_organisaties_post_update_organisatie(client, organisatie_factory):
    """ Test /organisaties/<organisatie_id> path """
    organisation = organisatie_factory.createOrganisatie(kvk_nummer=1)
    update_dict = {
        "naam": "testbedrijf"
    }
    response = client.post(
        f'/organisaties/{organisation.kvk_nummer}',
        data=json.dumps(update_dict),
        content_type='application/json'
    )
    assert response.status_code == 202
    assert response.json["data"]["naam"] == update_dict["naam"]
    assert response.json["data"] == organisation.to_dict()
    response = client.post(
        f'/organisaties/1337',
        data=json.dumps(update_dict),
        content_type='application/json'
    )
    assert response.status_code == 404

def test_organisaties_post_bad_requests(client):
    """ Test /organisaties/ path bad request """
    bad_data2 = {"naam": 12345}
    response = client.post(
        f'/organisaties/',
        data=json.dumps(bad_data2),
        content_type='application/json'
    )
    assert response.status_code == 400
    