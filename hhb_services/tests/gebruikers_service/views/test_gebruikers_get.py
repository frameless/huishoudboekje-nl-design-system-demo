""" Test GET /gebruikers """
from datetime import date
from hhb_models import Gebruiker, Burger

def test_gebruikers_get_empty_db(app):
    """ Test gebruikers call with empty database. """
    response = app.test_client().get('/gebruikers')
    assert response.status_code == 200
    assert {'data': []} == response.json

def test_gebruikers_get_single_gebruiker(app, session):
    """ Test gebruikers call with a single gebruiker in database. """
    gebruiker = Gebruiker(
        email="a@b.c",
        telefoonnummer="0612345678",
    )
    burger = Burger(
        gebruiker=gebruiker,
    )
    session.add(gebruiker)
    session.add(burger)
    session.flush()
    client = app.test_client()
    response = client.get('/gebruikers')
    assert response.status_code == 200
    assert response.json["data"] == [
        {
            "id": 1,
            "burger_id": 1,
            "email": "a@b.c",
            "telefoonnummer": "0612345678",
            "geboortedatum": ""
        }
    ]
