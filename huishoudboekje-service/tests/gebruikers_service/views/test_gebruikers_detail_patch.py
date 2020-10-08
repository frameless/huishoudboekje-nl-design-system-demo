""" Test PATCH /gebruikers/<gebruikers_id> """
from datetime import date
import json
from models import Gebruiker

def test_gebruikers_detail_patch_success(app, session):
    """ Test a succesfull PATCH on gebruikers_detail """
    gebruiker = Gebruiker(
        email="a@b.c",
        telefoonnummer="0612345678",
        geboortedatum=date(2020, 1, 1)
    )
    session.add(gebruiker)
    session.flush()
    edited_gebruiker = {
        "email": "c@b.a",
        "telefoonnummer": "0123456789",
        "geboortedatum": "2010-10-02"
    }
    client = app.test_client()
    response = client.patch('/gebruikers/1',
        data=json.dumps(edited_gebruiker), content_type='application/json')
    assert response.status_code == 200
    assert response.json["data"] == {
        "id": 1,
        "burger_id": None,
        "email": "c@b.a",
        "telefoonnummer": "0123456789",
        "geboortedatum": "2010-10-02",
        "ibannummer": None,
        "weergave_naam": None,
    }

def test_gebruikers_detail_patch_invalid_json(app, session):
    """ Test a succesfull PATCH on gebruikers_detail """
    gebruiker = Gebruiker(
        email="a@b.c",
        telefoonnummer="0612345678",
        geboortedatum=date(2020, 1, 1)
    )
    session.add(gebruiker)
    session.flush()
    edited_gebruiker = {
        "email": "c@b.a",
        "telefoonnummer": "0123456789",
        "geboortedatum": "02-05-2010"
    }
    client = app.test_client()
    response = client.patch('/gebruikers/1', 
        data=json.dumps(edited_gebruiker), content_type='application/json')
    assert response.status_code == 400
    assert response.json["errors"][0] == (
        "'02-05-2010' does not match '^(?:[0-9]{4}-[0-9]{2}-[0-9]{2}|)$'"
    )
