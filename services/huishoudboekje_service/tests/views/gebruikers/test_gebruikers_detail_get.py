""" Test GET /gebruikers/<gebruikers_id> """
import pytest
from core_service.utils import row2dict

def test_gebruikers_detail_get_success(client, gebruiker_factory):
    """ Test a succesfull GET on gebruikers_detail """
    gebruiker = gebruiker_factory.createGebruiker()
    response = client.get('/gebruikers/1')
    assert response.status_code == 200
    assert response.json["data"] == row2dict(gebruiker)


@pytest.mark.parametrize("gebruiker, statuscode, message", [
    ("1337", 404, "Gebruiker not found."),
    ("a", 400, "Supplied id 'a' is not an integer.")
])
def test_gebruikers_detail_get_invalid_gebruiker(app, gebruiker, statuscode, message):
    """ Test a GET on gebruikers_detail with a invalid gebruiker. """
    client = app.test_client()
    response = client.get(f'/gebruikers/{gebruiker}')
    assert response.status_code == statuscode
    assert response.json["errors"][0] == message
