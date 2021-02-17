""" Test POST /fruits/(<fruit_id>/) """
from tests.basket_service.models.fruit import Fruit


def test_fruit_post_new_basket(client, dbsession, basket_factory):
    """ Test /fruits/ path """
    basket = basket_factory.create_basket()
    assert dbsession.query(Fruit).count() == 0
    fruit_dict = {
        "basket_id": basket.id,
        "name": "Apple",
    }
    response = client.post(
        '/fruits/',
        json=fruit_dict,
    )
    assert response.json == {"data": {"basket_id": basket.id, 'id': 1, "name": "Apple"}}
    assert response.status_code == 201
    assert dbsession.query(Fruit).count() == 1


def test_fruit_post_multiple(client, dbsession, basket_factory):
    """ Test /fruits/ path """
    basket = basket_factory.create_basket()
    assert dbsession.query(Fruit).count() == 0
    fruit_dict = [
            {
                "basket_id": basket.id,
                "name": "Apple",
            },
            {
                "basket_id": basket.id,
                "name": "Pear",
            },
        ]
    response = client.post(
        '/fruits/',
        json=fruit_dict,
    )
    assert response.json == {"data": [{"basket_id": basket.id, 'id': 1, "name": "Apple"},{"basket_id": basket.id, 'id': 2, "name": "Pear"}]}
    assert response.status_code == 201
    assert dbsession.query(Fruit).count() == 2
