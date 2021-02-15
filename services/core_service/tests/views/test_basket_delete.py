""" Test DELETE /baskets/(<basket_id>/) """
from tests.basket_service.models.basket import Basket
from tests.basket_service.models.fruit import Fruit


def test_basket_delete_success(client, dbsession, basket_factory):
    """ Test a successful DELETE on basket """
    basket = basket_factory.create_basket()
    assert dbsession.query(Basket).count() == 1
    response = client.delete(f'/baskets/{basket.id}')
    assert response.status_code == 204
    assert dbsession.query(Basket).count() == 0

def test_basket_delete_cascade_transaction(client, dbsession, basket_factory, fruit_factory):
    basket = basket_factory.create_basket()
    fruit = fruit_factory.create_fruit(basket_id=basket.id)
    assert dbsession.query(Basket).count() == 1
    assert dbsession.query(Fruit).count() == 1
    response = client.delete(f'/baskets/{basket.id}')
    assert response.status_code == 204
    assert dbsession.query(Basket).count() == 0
    assert dbsession.query(Fruit).count() == 0

def test_basket_delete_bad_request(client):
    """ Test 400 error for DELETE on basket """
    response = client.delete('/baskets/')
    assert response.status_code == 405


def test_basket_delete_basket_not_found(client):
    """ Test 404 error for DELETE on baskets """
    response = client.delete('/baskets/1337')
    assert response.status_code == 404
