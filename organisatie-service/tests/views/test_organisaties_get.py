""" Test GET /organisaties """
from datetime import date

def test_organisaties_get_empty_db(client):
    """ Test organisaties GET call with empty database. """
    response = client.get('/organisaties')
    assert response.status_code == 200
    assert {'data': []} == response.json

def test_organisaties_get_with_data(client, dbsession, organisatie_factory):
    """ Test organisaties GET call with data """
    organisatie1 = organisatie_factory.createOrganisatie(kvk_nummer=1, naam="A")
    organisatie2 = organisatie_factory.createOrganisatie(kvk_nummer=2, naam="B")
    organisatie3 = organisatie_factory.createOrganisatie(kvk_nummer=3, naam="C")
    response = client.get('/organisaties')
    assert response.status_code == 200
    assert response.json["data"][0]["kvk_nummer"] == 1
    assert response.json["data"][0]["naam"] == "A"
    assert response.json["data"][1]["kvk_nummer"] == 2
    assert response.json["data"][1]["naam"] == "B"
    assert response.json["data"][2]["kvk_nummer"] == 3
    assert response.json["data"][2]["naam"] == "C"

def test_organisaties_get_with_data_and_filters(client, dbsession, organisatie_factory):
    """ Test organisaties GET call with data and filter_ids """
    organisatie1 = organisatie_factory.createOrganisatie(kvk_nummer=1, naam="A")
    organisatie2 = organisatie_factory.createOrganisatie(kvk_nummer=2, naam="B")
    organisatie3 = organisatie_factory.createOrganisatie(kvk_nummer=3, naam="C")
    response = client.get('/organisaties?filter_ids=2,3')
    assert response.status_code == 200
    assert response.json["data"][0]["kvk_nummer"] == 2
    assert response.json["data"][0]["naam"] == "B"
    assert response.json["data"][1]["kvk_nummer"] == 3
    assert response.json["data"][1]["naam"] == "C"

def test_organisaties_get_with_incorrect_filters(client, dbsession, organisatie_factory):
    """ Test organisaties GET call with incorrect filters """
    response = client.get('/organisaties?filter_ids=2,3,noint')
    assert response.status_code == 400
    assert response.json["errors"] == ['Input for filter_ids is not correct']
    