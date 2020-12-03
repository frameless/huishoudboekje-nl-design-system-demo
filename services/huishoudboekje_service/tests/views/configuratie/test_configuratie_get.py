""" Test GET /configuratie """
from models import Configuratie
from core_service.utils import row2dict

def test_configuraties_get_empty_db(app):
    """ Test configuratie call with empty database. """
    response = app.test_client().get('/configuratie')
    assert response.status_code == 200
    assert {'data': []} == response.json

def test_configuraties_get_single_configuratie(client, configuratie_factory):
    """ Test configuratie call with a single configuratie in database. """
    configuratie = configuratie_factory.createConfiguratie()
    response = client.get('/configuratie')
    assert response.status_code == 200
    assert response.json["data"] == [row2dict(configuratie)]
