""" Test GET /gebruikers/<gebruikers_id>/burger """
from datetime import date
from gebruikers_models import Gebruiker, Burger

def test_burgers_get_success(app, session):
    """ Test a succesfull GET on burgers """
    gebruiker = Gebruiker(
        email="a@b.c",
        telefoonnummer="0612345678",
        geboortedatum=date(2020, 1, 1)
    )
    burger = Burger(
        gebruiker=gebruiker,
        voornamen="Henk",
        voorletters="H.",
        voorvoegsel="van",
        geslachtsnaam="Poortvliet",
        straatnaam="Schoolstraat",
        huisnummer=1,
        huisletter="a",
        huistoevoeging="bis",
        postcode="1234AB",
        woonplaatsnaam="Sloothuizen"
    )
    session.add(gebruiker)
    session.add(burger)
    session.flush()
    client = app.test_client()
    response = client.get('/gebruikers/1/burger')
    assert response.status_code == 200
    assert response.json["data"] == {
        'gebruiker_id': 1,
        'geslachtsnaam': 'Poortvliet',
        'huisletter': 'a',
        'huisnummer': 1,
        'huistoevoeging': 'bis',
        'postcode': '1234AB',
        'straatnaam': 'Schoolstraat',
        'voorletters': 'H.',
        'voornamen': 'Henk',
        'voorvoegsel': 'van',
        'woonplaatsnaam': 'Sloothuizen'
    }

def test_burgers_get_for_gebruiker_without_burger(app, session):
    """ Test a GET on burgers where current gebruiker does not have a burger """
    gebruiker = Gebruiker(
        email="a@b.c",
        telefoonnummer="0612345678",
        geboortedatum=date(2020, 1, 1)
    )
    session.add(gebruiker)
    session.flush()
    client = app.test_client()
    response = client.get('/gebruikers/1/burger')
    assert response.status_code == 404
    assert response.json["errors"][0] == "The current Gebruiker does not have a Burger"
