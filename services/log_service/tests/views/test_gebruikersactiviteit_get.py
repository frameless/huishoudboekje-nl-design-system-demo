""" Test GET /gebruikersactiviteit/(<gebruikeractiviteit_id>/) """


def test_gebruikersactiviteit_get_success_all(client, gebruikersactiviteit_factory):
    """ Test /gebruikersactiviteiten/ path """
    ga1 = gebruikersactiviteit_factory.create_gebruikersactiviteit()
    ga2 = gebruikersactiviteit_factory.create_gebruikersactiviteit(action="create")
    response = client.get(f'/gebruikersactiviteiten/')
    assert response.status_code == 200
    assert len(response.json["data"]) == 2
    assert response.json["data"][0]["action"] == ga1.action == "update"
    assert response.json["data"][1]["action"] == ga2.action == "create"
