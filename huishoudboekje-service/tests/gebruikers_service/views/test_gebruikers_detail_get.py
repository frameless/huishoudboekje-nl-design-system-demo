""" Test GET /gebruikers/<gebruikers_id> """

import pytest


def test_gebruikers_detail_get_success(client, gebruiker_factory):
    """ Test a succesfull GET on gebruikers_detail """
    gebruiker = gebruiker_factory.createGebruiker()
    response = client.get('/gebruikers/1')
    assert response.status_code == 200
    assert response.json["data"] == gebruiker.to_dict()


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
