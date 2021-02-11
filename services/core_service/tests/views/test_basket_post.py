""" Test POST /baskets/(<basket_id>/) """

from tests.basket_service.models.basket import Basket


def test_basket_post_new_basket(client, dbsession):
    """ Test /baskets/ path """
    assert dbsession.query(Basket).count() == 0
    basket_dict = {
        "name": "palm",
    }
    response = client.post(
        '/baskets/',
        json=basket_dict,
    )
    assert response.status_code == 201
    basket_dict["id"] = 1
    assert response.json["data"]["name"] == basket_dict["name"]
    assert dbsession.query(Basket).count() == 1
