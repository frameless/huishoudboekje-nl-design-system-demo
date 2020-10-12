""" Test DELETE /organisaties """
import json
from datetime import date
from models.organisatie import Organisatie

def test_organisaties_delete_success(client, organisatie_factory, dbsession):
    """ Test organisaties DELETE success """
    organisatie = organisatie_factory.createOrganisatie(kvk_nummer=1)
    assert dbsession.query(Organisatie).count() == 1
    data = {
        "kvk_nummer": 1,
    }
    response = client.delete('/organisaties', data=json.dumps(data), content_type='application/json')
    assert response.status_code == 204
    assert dbsession.query(Organisatie).count() == 0

def test_organisaties_delete_invalid_inputs_missing_kvk_nummer(client):
    """ Test organisaties DELETE invalid inputs missing kvk_nummer """
    response = client.delete('/organisaties', data=json.dumps({}), content_type='application/json')
    assert response.status_code == 400
    assert response.json["errors"] == ["'kvk_nummer' is a required property"]

def test_organisaties_delete_invalid_inputs_missing_organisatie(client):
    """ Test organisaties DELETE invalid inputs missing organisatie """
    response = client.delete('/organisaties', data=json.dumps({"kvk_nummer": 1}), content_type='application/json')
    assert response.status_code == 404
    assert response.json["errors"] == ["Organisatie not found."]