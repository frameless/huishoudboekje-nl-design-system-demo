""" Test GET /baskets/(<basket_id>/) """


def test_basket_get_success_all(client, basket_factory):
    """ Test /baskets/ path """
    basket1 = basket_factory.create_basket(name="palm")
    basket2 = basket_factory.create_basket(name="bamboo")
    response = client.get(f'/baskets/')
    assert response.status_code == 200
    assert len(response.json["data"]) == 2
    assert response.json["data"][0]["name"] == basket1.name
    assert response.json["data"][1]["name"] == basket2.name


def test_basket_get_success_by_id(client, basket_factory):
    """ Test /baskets/ path """
    basket1 = basket_factory.create_basket(name="palm")
    basket2 = basket_factory.create_basket(name="bamboo")
    response = client.get(f'/baskets/{basket1.id}')
    assert response.status_code == 200
    data = response.json["data"]
    assert type(data) == dict
    assert data["name"] == basket1.name


def test_basket_get_success_by_multi_id(client, basket_factory):
    """ Test /baskets/ path """
    basket1 = basket_factory.create_basket(name="palm")
    basket2 = basket_factory.create_basket(name="bamboo")
    basket3 = basket_factory.create_basket(name="wicker")
    response = client.get(f'/baskets/{basket1.id},{basket3.id}')
    assert response.json == {
        "data": [{"id": 1, "name": "palm", "fruits": []}, {"id": 3, "name": "wicker", "fruits": []}]}
    assert response.status_code == 200
    assert len(response.json["data"]) == 2


def test_basket_get_success_resolve_fruits(client, basket_factory, fruit_factory):
    """ Test /baskets/ path """
    basket = basket_factory.create_basket()
    fruit = fruit_factory.create_fruit(basket_id=basket.id)
    response = client.get(f'/baskets/')
    assert response.status_code == 200
    assert len(response.json["data"]) == 1
    assert len(response.json["data"][0]["fruits"]) == 1
    assert response.json["data"][0]["fruits"][0] == fruit.id
