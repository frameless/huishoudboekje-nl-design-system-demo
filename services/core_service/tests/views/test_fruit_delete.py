""" Test DELETE /fruits/(<fruit_id>/) """
from tests.basket_service.models.fruit import Fruit


def test_fruit_delete_success(client, dbsession, fruit_factory):
    """ Test a succesfull DELETE on fruit """
    fruit = fruit_factory.create_fruit()
    assert dbsession.query(Fruit).count() == 1
    response = client.delete(f'/fruits/{fruit.id}')
    assert response.status_code == 204
    assert dbsession.query(Fruit).count() == 0


def test_fruit_delete_bad_request(client):
    """ Test 405 error for DELETE on fruit """
    response = client.delete('/fruits/')
    assert response.status_code == 405


def test_fruit_delete_basket_not_found(client):
    """ Test 404 error for DELETE on fruit """
    response = client.delete('/fruits/1337')
    assert response.status_code == 404
