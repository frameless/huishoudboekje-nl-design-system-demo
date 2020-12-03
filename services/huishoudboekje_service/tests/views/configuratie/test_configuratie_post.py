""" Test POST /configuraties """


def test_configuraties_post_success(app):
    """ Test successful post of new configuratie"""
    configuratie_data = {
        "id": "telefoonnummer",
        "waarde": "0612345678",
    }
    response = app.test_client().post('/configuratie', json=configuratie_data)
    assert response.status_code == 201
    assert response.json["data"] == {
        "id": "telefoonnummer",
        "waarde": "0612345678",
    }


def test_configuraties_post_input_json_validation_key(app):
    """ Test id validation when making a new configuratie """
    configuratie_data = {
        "id": "a@b.c",
    }
    response = app.test_client().post('/configuratie', json=configuratie_data)
    assert response.status_code == 400
    assert response.json["errors"][0] == (
        "'a@b.c' does not match '^[a-zA-Z0-9_]+$'"
    )
