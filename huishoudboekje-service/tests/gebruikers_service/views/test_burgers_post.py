""" Test POST /gebruikers/<gebruikers_id>/burger """
from datetime import date
import json
from models import Gebruiker, Burger

def test_burgers_post_success(app, session):
    """ Test a succesfull POST on burgers """
    gebruiker = Gebruiker(
        email="a@b.c",
        telefoonnummer="0612345678",
        geboortedatum=date(2020, 1, 1)
    )
    session.add(gebruiker)
    session.flush()
    new_burger = {
        'achternaam': 'Poortvliet',
        'huisnummer': '1a',
        'postcode': '1234AB',
        'straatnaam': 'Schoolstraat',
        'voorletters': 'H.',
        'voornamen': 'Henk',
        'woonplaatsnaam': 'Sloothuizen'
    }
    client = app.test_client()
    response = client.post('/gebruikers/1/burger',
        data=json.dumps(new_burger), content_type='application/json')
    assert response.status_code == 200
    assert response.json["data"] == {
        'gebruiker_id': 1,
        'achternaam': 'Poortvliet',
        'huisnummer': "1a",
        'postcode': '1234AB',
        'straatnaam': 'Schoolstraat',
        'voorletters': 'H.',
        'voornamen': 'Henk',
        'woonplaatsnaam': 'Sloothuizen'
    }

def test_burgers_post_gebruiker_already_has_a_burger(app, session):
    """ Test 409 response for POST on burgers """
    gebruiker = Gebruiker(
        email="a@b.c",
        telefoonnummer="0612345678",
        geboortedatum=date(2020, 1, 1)
    )
    burger = Burger(
        gebruiker=gebruiker,
        voornamen="Henk",
        voorletters="H.",
        achternaam="Poortvliet",
        straatnaam="Schoolstraat",
        huisnummer="1a",
        postcode="1234AB",
        woonplaatsnaam="Sloothuizen"
    )
    session.add(gebruiker)
    session.add(burger)
    session.flush()
    new_burger = {
        'achternaam': 'Poortvliet',
        'huisnummer': '1a',
        'postcode': '1234AB',
        'straatnaam': 'Schoolstraat',
        'voorletters': 'H.',
        'voornamen': 'Henk',
        'woonplaatsnaam': 'Sloothuizen'
    }
    client = app.test_client()
    response = client.post('/gebruikers/1/burger',
        data=json.dumps(new_burger), content_type='application/json')
    assert response.status_code == 409
    assert response.json["errors"][0] == "The current Gebruiker already has a Burger"

def test_burgers_post_json_validation(app, session):
    """ Test JSON validation for POST on burgers """
    gebruiker = Gebruiker(
        email="a@b.c",
        telefoonnummer="0612345678",
        geboortedatum=date(2020, 1, 1)
    )
    session.add(gebruiker)
    session.flush()
    new_burger = {
        'huisnummer': '1a',
        'postcode': '1234AB',
        'straatnaam': 'Schoolstraat',
        'voorletters': 'H.',
        'voornamen': 'Henk',
        'woonplaatsnaam': 'Sloothuizen'
    }
    client = app.test_client()
    response = client.post('/gebruikers/1/burger',
        data=json.dumps(new_burger), content_type='application/json')
    assert response.status_code == 400
    assert response.json["errors"][0] == "'achternaam' is a required property"