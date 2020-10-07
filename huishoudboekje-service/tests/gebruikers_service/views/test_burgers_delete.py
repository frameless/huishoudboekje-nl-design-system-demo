""" Test DELETE /gebruikers/<gebruikers_id>/burger """
from datetime import date
from models import Gebruiker, Burger

def test_burgers_delete_success(app, session):
    """ Test a succesfull DELETE on burgers """
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
    client = app.test_client()
    response = client.delete('/gebruikers/1/burger')
    assert response.status_code == 204
    assert session.query(Burger).count() == 0