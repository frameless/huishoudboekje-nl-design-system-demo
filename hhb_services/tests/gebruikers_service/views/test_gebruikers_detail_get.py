""" Test GET /gebruikers/<gebruikers_id> """
from datetime import date
from hhb_models import Gebruiker
import pytest

def test_gebruikers_detail_get_success(app, session):
    """ Test a succesfull GET on gebruikers_detail """
    gebruiker = Gebruiker(
        email="a@b.c",
        telefoonnummer="0612345678",
        geboortedatum=date(2020, 1, 1)
    )
    session.add(gebruiker)
    session.flush()
    client = app.test_client()
    response = client.get('/gebruikers/1')
    assert response.status_code == 200
    assert response.json["data"] == {
        "id": 1,
        "burger_id": None,
        "email": "a@b.c",
        "telefoonnummer": "0612345678",
        "geboortedatum": "2020-01-01"
    }

@pytest.mark.parametrize("gebruiker, statuscode, message", [
    ("1337", 404, "The requested resource could not be found."),
    ("a", 400, "The supplied gebruiker_id is not a number.")
])
def test_gebruikers_detail_get_invalid_gebruiker(app, gebruiker, statuscode, message):
    """ Test a GET on gebruikers_detail with a invalid gebruiker. """
    client = app.test_client()
    response = client.get(f'/gebruikers/{gebruiker}')
    assert response.status_code == statuscode
    assert response.json["errors"][0] == message
