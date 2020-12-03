""" Test GET /configuratie/<configuratie_id> """
import pytest
from core_service.utils import row2dict

def test_configuraties_detail_get_success(client, configuratie_factory):
    """ Test a successful GET on configuratie_detail """
    configuratie = configuratie_factory.createConfiguratie()
    response = client.get('/configuratie/ab_45')
    assert response.status_code == 200
    assert response.json["data"] == row2dict(configuratie)


@pytest.mark.parametrize("configuratie, statuscode, message", [
    ("1337", 404, "Configuratie not found."),
])
def test_configuraties_detail_get_invalid_configuratie(app, configuratie, statuscode, message):
    """ Test a GET on configuratie_detail with a invalid configuratie. """
    client = app.test_client()
    response = client.get(f'/configuratie/{configuratie}')
    assert response.status_code == statuscode
    assert response.json["errors"][0] == message
