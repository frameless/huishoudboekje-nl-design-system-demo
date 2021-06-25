""" Test GET /huishoudens/(<huishouden_id>/) """


def test_huishouden_get_success_multiple(client, huishouden_factory):
    huishouden1 = huishouden_factory.createHuishouden()
    huishouden2 = huishouden_factory.createHuishouden()
    response = client.get(f'/huishoudens/')
    assert response.status_code == 200
    assert len(response.json["data"]) == 2
    assert response.json["data"][0]["id"] == huishouden1.id
    assert response.json["data"][1]["id"] == huishouden2.id


def test_huishouden_get_success_single(client, huishouden_factory):
    huishouden1 = huishouden_factory.createHuishouden()
    huishouden2 = huishouden_factory.createHuishouden()
    response = client.get(f'/huishoudens/{huishouden2.id}')
    assert response.status_code == 200
    assert response.json["data"]["id"] == huishouden2.id


def test_huishouden_failure_not_found(client):
    response = client.get('/huishoudens/1337')
    assert response.status_code == 404
    assert response.json["errors"][0] == "Huishouden not found."


def test_huishouden_filter_columns(client, huishouden_factory):
    huishouden1 = huishouden_factory.createHuishouden()
    huishouden2 = huishouden_factory.createHuishouden()
    response = client.get('/huishoudens/?columns=id')
    assert response.status_code == 200
    assert response.json["data"] == [
        {"id": huishouden1.id},
        {"id": huishouden2.id}
    ]
    response = client.get(f'/huishoudens/{huishouden2.id}?columns=id')
    assert response.status_code == 200
    assert response.json["data"] == {"id": huishouden2.id}


def test_huishouden_filter_invalid_column(client):
    response = client.get('/huishoudens/?columns=non-field')
    assert response.status_code == 400
    assert response.json["errors"][0] == "Input for columns is not correct, 'non-field' is not a column."


def test_huishouden_get_burgers_relation(client, huishouden_factory, burger_factory):
    huishouden = huishouden_factory.createHuishouden()
    burger1 = burger_factory.createBurger(huishouden_id=huishouden.id)
    burger2 = burger_factory.createBurger(huishouden_id=huishouden.id)

    response = client.get(f'/huishoudens/{huishouden.id}')

    assert len(response.json["data"]["burgers"]) == 2
    assert response.json["data"]["burgers"][0] == burger1.id
    assert response.json["data"]["burgers"][1] == burger2.id
