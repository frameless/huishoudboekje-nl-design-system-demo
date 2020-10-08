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
        'huisnummer': 1,
    }
    client = app.test_client()
    response = client.post('/gebruikers/1/burger',
        data=json.dumps(new_burger), content_type='application/json')
    assert response.status_code == 400
    assert response.json["errors"][0] == "1 is not of type 'string'"

def test_burgers_patch_success(app, session):
    """ Test a succesfull PATCH on burgers """
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
    edit_burger = {
        'achternaam': 'Poortvliet_edited',
        'huisnummer': '1337',
        'postcode': '1234AB_edited',
        'straatnaam': 'Schoolstraat_edited',
        'voorletters': 'H._edited',
        'voornamen': 'Henk_edited',
        'woonplaatsnaam': 'Sloothuizen_edited'
    }
    client = app.test_client()
    response = client.post('/gebruikers/1/burger',
        data=json.dumps(edit_burger), content_type='application/json')
    assert response.status_code == 200
    assert response.json["data"] == {
        'gebruiker_id': 1,
        'achternaam': 'Poortvliet_edited',
        'huisnummer': '1337',
        'postcode': '1234AB_edited',
        'straatnaam': 'Schoolstraat_edited',
        'voorletters': 'H._edited',
        'voornamen': 'Henk_edited',
        'woonplaatsnaam': 'Sloothuizen_edited'
    }

def test_burgers_patch_json_validation(app, session):
    """ Test a succesfull PATCH on burgers """
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
    edit_burger = {
        'achternaam': 1337
    }
    client = app.test_client()
    response = client.post('/gebruikers/1/burger',
        data=json.dumps(edit_burger), content_type='application/json')
    print(response.json)
    assert response.status_code == 400
    assert response.json["errors"][0] == "1337 is not of type 'string'"