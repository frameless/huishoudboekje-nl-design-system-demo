""" Test POST /organisaties """
import json
from datetime import date

def test_organisaties_post_success(client):
    """ Test organisaties POST with all fields """
    data = {
        "kvk_nummer": 12345,
        "naam": "Test Organisatie",
        "straatnaam": "Schoolstraat",
        "huisnummer": "1",
        "postcode": "1234AB",
        "plaatsnaam": "Sloothuizen"
    }
    response = client.post('/organisaties', data=json.dumps(data), content_type='application/json')
    assert response.status_code == 202
    assert response.json["data"] == data

def test_organisaties_post_update_success(client, organisatie_factory):
    """ Test organisaties POST as an update """
    organisatie = organisatie_factory.createOrganisatie(kvk_nummer=1, naam="A")
    data = {
        "kvk_nummer": 1,
        "naam": "B"
    }
    assert organisatie.naam == "A"
    response = client.post('/organisaties', data=json.dumps(data), content_type='application/json')
    assert response.status_code == 202
    assert organisatie.naam == "B"

def test_organisaties_post_invalid_inputs_missing_kvk_nummer(client):
    """ Test organisaties POST invalid inputs missing kvk_nummer """
    data = {
        "naam": "B"
    }
    response = client.post('/organisaties', data=json.dumps(data), content_type='application/json')
    assert response.status_code == 400
    assert response.json["errors"] == ["'kvk_nummer' is a required property"]