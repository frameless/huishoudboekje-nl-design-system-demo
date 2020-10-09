""" Test POST /gebruikers """
import json
import pytest

def test_gebruikers_post_success(app):
    """ Test succesfull post of new gebruiker"""
    gebruiker_data = {
        "email": "a@b.c",
        "telefoonnummer": "0612345678",
        "geboortedatum": "2020-01-01"
    }
    response = app.test_client().post('/gebruikers',
        data=json.dumps(gebruiker_data), content_type='application/json')
    print(response.json)
    assert response.status_code == 201
    assert response.json["data"] == {
            "id": 1,
            "burger_id": None,
            "email": "a@b.c",
            "telefoonnummer": "0612345678",
            "geboortedatum": "2020-01-01",
            'iban': None,
            'weergave_naam': None,
        }

def test_gebruikers_post_input_json_validation_invalid_geboortedatum(app):
    """ Test geboortedatum validation when making a new gebruiker """
    gebruiker_data = {
        "email": "a@b.c",
        "telefoonnummer": "0612345678",
        "geboortedatum": "01-01-2020"
    }
    response = app.test_client().post('/gebruikers',
        data=json.dumps(gebruiker_data), content_type='application/json')
    assert response.status_code == 400
    assert response.json["errors"][0] == (
        "'01-01-2020' does not match '^(?:[0-9]{4}-[0-9]{2}-[0-9]{2}|)$'"
    )
