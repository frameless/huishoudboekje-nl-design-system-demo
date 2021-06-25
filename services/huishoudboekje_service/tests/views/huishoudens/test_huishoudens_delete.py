""" Test DELETE /huishoudens/(<huishouden_id>/) """
from models.huishouden import Huishouden


def test_huishoudens_delete_success(client, session, huishouden_factory):
    """ Test a successful DELETE on huishoudens """
    huishouden = huishouden_factory.createHuishouden()
    assert session.query(Huishouden).count() == 1
    response = client.delete(f'/huishoudens/{huishouden.id}')
    assert response.status_code == 204
    assert session.query(Huishouden).count() == 0


def test_huishoudens_delete_method_not_allowed(client):
    """ Test 405 error for DELETE on organisaties """
    response = client.delete('/huishoudens/')
    assert response.status_code == 405


def test_huishoudens_delete_not_found(client):
    """ Test 404 error for DELETE on huishoudens """
    response = client.delete('/huishoudens/1337')
    assert response.status_code == 404
