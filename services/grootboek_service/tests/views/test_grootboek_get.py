""" Test GET /grootboekrekeningen/(<grootboekrekening_id>/) """

def test_grootboek_get_success_all(client, grootboekrekening_factory):
    """ Test /grootboekrekeningen/ path """
    grootboek1 = grootboekrekening_factory.create_grootboekrekening("1", naam="grootboek1")
    grootboek2 = grootboekrekening_factory.create_grootboekrekening("2", naam="grootboek2")
    response = client.get(f'/grootboekrekeningen/')
    assert response.status_code == 200
    assert len(response.json["data"]) == 2
    assert response.json["data"][0]["naam"] == grootboek1.naam
    assert response.json["data"][1]["naam"] == grootboek2.naam

def test_grootboek_get_success_one(client, grootboekrekening_factory):
    """ Test /grootboekrekeningen/<grootboekrekening_id> path """
    grootboek1 = grootboekrekening_factory.create_grootboekrekening("1", naam="grootboek1")
    response = client.get(f'/grootboekrekeningen/{grootboek1.id}')
    assert response.status_code == 200
    assert response.json["data"]["naam"] == grootboek1.naam

def test_grootboek_get_success_exposed_children(client, grootboekrekening_factory):
    """ Test /grootboekrekeningen/(<grootboekrekening_id>) path """
    grootboek1 = grootboekrekening_factory.create_grootboekrekening("1", naam="grootboek1")
    grootboek2 = grootboekrekening_factory.create_grootboekrekening("2", naam="grootboek2")
    grootboek3 = grootboekrekening_factory.create_grootboekrekening("3", naam="grootboek3", parent_id=grootboek1.id)
    grootboek4 = grootboekrekening_factory.create_grootboekrekening("4", naam="grootboek4", parent_id=grootboek1.id)
    response = client.get(f'/grootboekrekeningen/')
    assert response.status_code == 200
    assert len(response.json["data"]) == 4
    assert len(response.json["data"][0]["children"]) == 2
    assert len(response.json["data"][1]["children"]) == 0
    assert len(response.json["data"][2]["children"]) == 0
    assert len(response.json["data"][3]["children"]) == 0
    assert response.json["data"][0]["children"] == [grootboek3.id, grootboek4.id]

def test_grootboek_get_success_filter_ids_with_leading_zero(client, grootboekrekening_factory):
    """ Test /grootboekrekeningen/(<grootboekrekening_id>) path """
    grootboek1 = grootboekrekening_factory.create_grootboekrekening("01337", naam="grootboek1")
    grootboek2 = grootboekrekening_factory.create_grootboekrekening("1337", naam="grootboek2")
    response = client.get(f'/grootboekrekeningen/?filter_ids={grootboek1.id}')
    assert response.status_code == 200
    assert response.json["data"][0]["id"] == grootboek1.id