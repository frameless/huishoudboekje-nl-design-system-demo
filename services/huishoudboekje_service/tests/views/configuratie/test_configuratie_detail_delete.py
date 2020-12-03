""" Test DELETE /configuratie/<configuratie_id> """
from models import Configuratie


def test_configuraties_detail_delete_success(client, session, configuratie_factory):
    """ Test a successful DELETE on configuratie_detail """
    configuratie = configuratie_factory.createConfiguratie()
    assert session.query(Configuratie).count() == 1
    response = client.delete(f'/configuratie/{configuratie.id}')
    assert response.status_code == 204
    assert session.query(Configuratie).count() == 0
