""" Test GET /fruits/(<fruit_id>/) """


def test_fruit_get_success_all(client, fruit_factory):
    """ Test /fruits/(<fruit_id>) path """
    fruit1 = fruit_factory.create_fruit(name="stmt1")
    fruit2 = fruit_factory.create_fruit(name="stmt2")
    response = client.get(f'/fruits/')
    assert response.status_code == 200
    assert len(response.json["data"]) == 2
    assert response.json["data"][0]["name"] == fruit1.name
    assert response.json["data"][1]["name"] == fruit2.name


def test_fruit_get_success_one(client, fruit_factory):
    """ Test /fruits/(<fruit_id>) path """
    fruit1 = fruit_factory.create_fruit(name="apple")
    response = client.get(f'/fruits/{fruit1.id}')
    assert response.status_code == 200
    assert response.json["data"]["name"] == fruit1.name


def test_fruit_get_success_filter_baskets(client, fruit_factory):
    """ Test /fruits/(<fruit_id>) path """
    fruit1 = fruit_factory.create_fruit(name="apple")
    fruit2 = fruit_factory.create_fruit(name="pear")
    assert fruit1.basket_id != fruit2.basket_id
    response = client.get(f'/fruits/?filter_baskets={fruit1.basket_id}')
    assert response.status_code == 200
    assert len(response.json["data"]) == 1
    assert response.json["data"][0]["id"] == fruit1.id

#
# def test_fruit_get_success_filter_is_geboekt(client, fruit_factory):
#     """ Test /fruits/(<fruit_id>) path """
#     fruit1 = fruit_factory.create_fruit(is_geboekt=None)
#     fruit2 = fruit_factory.create_fruit(is_geboekt=False)
#     fruit3 = fruit_factory.create_fruit(is_geboekt=True)
# 
#     response = client.get(f'/fruits/?filter_is_geboekt=false')
#     assert response.status_code == 200
#     assert len(response.json["data"]) == 2
# 
#     assert response.json["data"][0]["id"] == fruit1.id
#     assert response.json["data"][1]["id"] == fruit2.id
#     assert fruit3.id not in [bt["id"] for bt in response.json["data"]]
# 
#     response = client.get(f'/fruits/?filter_is_geboekt=true')
#     assert response.status_code == 200
#     assert len(response.json["data"]) == 1
#     assert response.json["data"][0]["id"] == fruit3.id
# 
# 
# def test_fruit_get_success_filter_is_geboekt_and_basket(client, fruit_factory, basket_factory):
#     """ Test /fruits/(<fruit_id>) path """
#     basket1 = basket_factory.create_basket()
#     basket2 = basket_factory.create_basket()
#     fruit11 = fruit_factory.create_fruit(basket_id=basket1.id,
#                                                                         is_geboekt=None)
#     fruit12 = fruit_factory.create_fruit(basket_id=basket1.id,
#                                                                         is_geboekt=None)
#     fruit13 = fruit_factory.create_fruit(basket_id=basket1.id,
#                                                                         is_geboekt=True)
#     fruit21 = fruit_factory.create_fruit(basket_id=basket2.id,
#                                                                         is_geboekt=None)
# 
#     response = client.get(f'/fruits/?filter_baskets={basket1.id}&filter_is_geboekt=false')
#     assert response.status_code == 200
#     assert len(response.json["data"]) == 2
# 
#     assert response.json["data"][0]["id"] == fruit11.id
#     assert response.json["data"][1]["id"] == fruit12.id
# 
#     assert fruit13.id not in [bt["id"] for bt in response.json["data"]]
#     assert fruit21.id not in [bt["id"] for bt in response.json["data"]]
