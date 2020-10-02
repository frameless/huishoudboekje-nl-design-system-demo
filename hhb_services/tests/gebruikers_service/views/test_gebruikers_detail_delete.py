""" Test DELETE /gebruikers/<gebruikers_id> """
from datetime import date
from hhb_models import Gebruiker

def test_gebruikers_detail_get_success(app, session):
    """ Test a succesfull DELETE on gebruikers_detail """
    gebruiker = Gebruiker(
        email="a@b.c",
        telefoonnummer="0612345678",
        geboortedatum=date(2020, 1, 1)
    )
    session.add(gebruiker)
    session.flush()
    client = app.test_client()
    response = client.delete('/gebruikers/1')
    assert response.status_code == 204
    assert session.query(Gebruiker).count() == 0
