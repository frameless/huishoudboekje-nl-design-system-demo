""" Test GET /gebruikers """
from models import Gebruiker
from core_service.utils import row2dict

def test_gebruikers_get_empty_db(app):
    """ Test gebruikers call with empty database. """
    response = app.test_client().get('/gebruikers')
    assert response.status_code == 200
    assert {'data': []} == response.json

def test_gebruikers_get_single_gebruiker(client, gebruiker_factory):
    """ Test gebruikers call with a single gebruiker in database. """
    gebruiker = gebruiker_factory.createGebruiker()
    response = client.get('/gebruikers')
    assert response.status_code == 200
    assert response.json["data"] == [row2dict(gebruiker)]
