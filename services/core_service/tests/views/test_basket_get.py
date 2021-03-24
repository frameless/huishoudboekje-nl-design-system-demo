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

def test_basket_get_success_paged(client, basket_factory):
    """ Test /baskets/ path """
    basket1 = basket_factory.create_basket(name="bamboo1")
    basket2 = basket_factory.create_basket(name="bamboo2")
    basket3 = basket_factory.create_basket(name="bamboo3")
    basket4 = basket_factory.create_basket(name="bamboo4")
    basket5 = basket_factory.create_basket(name="bamboo5")
    basket6 = basket_factory.create_basket(name="bamboo6")
    basket7 = basket_factory.create_basket(name="bamboo7")
    basket8 = basket_factory.create_basket(name="bamboo8")
    basket9 = basket_factory.create_basket(name="bamboo9")
    basket10 = basket_factory.create_basket(name="bambo010")
    basket11 = basket_factory.create_basket(name="bamboo11")
    response = client.get(f'/baskets/?start=1&limit=10')
    assert response.status_code == 200
    assert len(response.json["data"]) == 10
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
