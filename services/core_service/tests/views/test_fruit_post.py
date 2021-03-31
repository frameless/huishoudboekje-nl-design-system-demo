""" Test POST /fruits/(<fruit_id>/) """
import pytest

from tests.basket_service.models.fruit import Fruit
from tests.factories.basket_factory import BasketFactory
from tests.factories.fruit_factory import FruitFactory


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


@pytest.mark.parametrize("fruits,ids,payload,expected_statuscode,expected_message,expected_data", [
    ([],
     "",
     [{"id": 1, "basket_id": 1, "name": "Apple"}],
     201,
     None,
     [{'basket_id': 1, 'id': 1, 'name': 'Apple'}]),
    ([],
     "",
     {"id": 1, "basket_id": 1, "name": "Apple"},
     201,
     None,
     {'basket_id': 1, 'id': 1, 'name': 'Apple'}),
    ([],
     "",
     [{"id": 1, "basket_id": 1, "name": "Apple"}, {"id": 2, "basket_id": 1, "name": "Grape"}],
     201,
     None,
     [{'basket_id': 1, 'id': 1, 'name': 'Apple'}, {'basket_id': 1, 'id': 2, 'name': 'Grape'}]),
    ([{"id": 1, "name": "apple"}],
     "",
     [{"id": 1, "basket_id": 1, "name": "Apple"}],
     409,
     'Key (id)=(1) already exists.',
     None),
    ([{"id": 2, "name": "grape"}],
     "",
     [{"id": 1, "basket_id": 1, "name": "Apple"}, {"id": 2, "basket_id": 1, "name": "Grape"}],
     409,
     'Key (id)=(2) already exists.',
     None),
    ([{"id": 1, "name": "apple"}],
     "1",
     {"id": 1, "basket_id": 1, "name": "Apple"},
     200,
     None,
     {'basket_id': 1, 'id': 1, 'name': 'Apple'}),
    ([{"id": 1, "name": "apple"}, {"id": 2, "name": "grape"}],
     "1,2",
     [{"id": 1, "basket_id": 1, "name": "Apple"}, {"id": 2, "basket_id": 1, "name": "Grape"}],
     200,
     None,
     [{'basket_id': 1, 'id': 1, 'name': 'Apple'}, {'basket_id': 1, 'id': 2, 'name': 'Grape'}]),
    ([{"id": 1, "name": "Apple"}, {"id": 2, "name": "Grape"}],
     "2,1",
     [{"id": 1, "basket_id": 1, "name": "Apple"}, {"id": 2, "basket_id": 1, "name": "Grape"}],
     200,
     None,
     [{'basket_id': 1, 'id': 1, 'name': 'Apple'}, {'basket_id': 1, 'id': 2, 'name': 'Grape'}]),
    ([{"id": 1, "name": "Apple"}, {"id": 2, "name": "Grape"}],
     "3",
     {"id": 3, "basket_id": 1, "name": "Berry"},
     404,
     "Fruit not found.",
     None),
    ([{"id": 1, "name": "Apple"}],
     "1,2",
     [{"id": 1, "basket_id": 1, "name": "Apple"}, {"id": 2, "basket_id": 1, "name": "Grape"}],
     404,
     "Fruit not found.",
     None),
    ([],
     "",
     [{"id": 1, "basket_id": 2, "name": "Apple"}],
     409,
     'Key (basket_id)=(2) is not present in table "basket".',
     None),
])
def test_fruit_update_(client, dbsession, basket_factory: BasketFactory, fruit_factory: FruitFactory, fruits, ids,
                       payload, expected_statuscode, expected_message, expected_data):
    """ Test /fruits/ path """
    basket = basket_factory.create_basket()
    for fruit in fruits:
        fruit_factory.create_fruit(basket_id=basket.id, **fruit)
    assert dbsession.query(Fruit).count() == len(fruits)

    response = client.post(
        f"/fruits/{ids}",
        json=payload,
    )
    assert response.status_code == expected_statuscode
    if expected_message:
        assert response.json["errors"][0] == expected_message
    if expected_data:
        assert response.json["data"] == expected_data
