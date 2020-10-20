""" Test POST /organisaties/(<organisatie_id>/) """
import json
from models.organisatie import Organisatie

def test_organisaties_post_new_organisation(client, session):
    """ Test /organisaties/ path """
    assert session.query(Organisatie).count() == 0
    organisatie_dict = {
        "kvk_nummer": 1,
        "weergave_naam": "testbedrijf"
    }
    response = client.post(
        '/organisaties/',
        data=json.dumps(organisatie_dict),
        content_type='application/json'
    )
    assert response.status_code == 201
    organisatie_dict["id"] = 1
    assert response.json["data"] == organisatie_dict
    assert session.query(Organisatie).count() == 1

def test_organisaties_post_update_organisatie(client, session, organisatie_factory):
    """ Test /organisaties/<organisatie_id> path """
    organisation = organisatie_factory.createOrganisatie(kvk_nummer=1, weergave_naam="Test Bedrijf")
    update_dict = {
        "kvk_nummer": 2,
        "weergave_naam": "testbedrijf"
    }
    response = client.post(
        f'/organisaties/{organisation.id}',
        data=json.dumps(update_dict),
        content_type='application/json'
    )
    assert response.status_code == 202
    update_dict["id"] = organisation.id
    assert response.json["data"] == update_dict == organisation.to_dict()
    response = client.post(
        f'/organisaties/1337',
        data=json.dumps(update_dict),
        content_type='application/json'
    )
    assert response.status_code == 404

def test_organisaties_post_bad_requests(client):
    """ Test /organisaties/ path bad request """
    bad_data1 = {"kvk_nummer": "NaN"}
    response = client.post(
        f'/organisaties/',
        data=json.dumps(bad_data1),
        content_type='application/json'
    )
    assert response.status_code == 400
    bad_data2 = {"weergave_naam": 12345}
    response = client.post(
        f'/organisaties/',
        data=json.dumps(bad_data2),
        content_type='application/json'
    )
    assert response.status_code == 400
    