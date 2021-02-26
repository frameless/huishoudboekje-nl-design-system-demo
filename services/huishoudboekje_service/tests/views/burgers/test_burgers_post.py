""" Test POST /burgers """
import json


def test_burgers_post_success(app):
    """ Test succesfull post of new burger"""
    burger_data = {
        "email": "a@b.c",
        "telefoonnummer": "0612345678",
        "geboortedatum": "2020-01-01"
    }
    response = app.test_client().post('/burgers',
                                      data=json.dumps(burger_data), content_type='application/json')
    assert response.status_code == 201
    assert response.json["data"] == {'achternaam': None,
                                     'email': 'a@b.c',
                                     'geboortedatum': '2020-01-01',
                                     'huisnummer': None,
                                     'iban': None,
                                     'id': 1,
                                     'postcode': None,
                                     'straatnaam': None,
                                     'telefoonnummer': '0612345678',
                                     'voorletters': None,
                                     'voornamen': None,
                                     'plaatsnaam': None}


def test_burgers_post_input_json_validation_invalid_geboortedatum(app):
    """ Test geboortedatum validation when making a new burger """
    burger_data = {
        "email": "a@b.c",
        "telefoonnummer": "0612345678",
        "geboortedatum": "01-01-2020"
    }
    response = app.test_client().post('/burgers',
                                      data=json.dumps(burger_data), content_type='application/json')
    assert response.status_code == 400
    assert response.json["errors"][0] == (
        "'01-01-2020' does not match '^(?:[0-9]{4}-[0-9]{2}-[0-9]{2}|)$'"
    )
