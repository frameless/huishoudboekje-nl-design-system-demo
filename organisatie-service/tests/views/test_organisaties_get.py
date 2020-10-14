""" Test GET /organisaties/(<organisatie_id>/) """
from models.organisatie import Organisatie

def test_organisaties_get_success_all(client, organisatie_factory):
    """ Test /organisaties/ path """
    organisatie1 = organisatie_factory.createOrganisatie(kvk_nummer=1)
    organisatie2 = organisatie_factory.createOrganisatie(kvk_nummer=2)
    response = client.get(f'/organisaties/')
    assert response.status_code == 200
    assert response.json["data"] == [organisatie1.to_dict(), organisatie2.to_dict()]

def test_organisaties_get_with_kvk_nummer(client, organisatie_factory):
    """ Test /organisaties/<kvk_nummer>/ path """
    organisatie1 = organisatie_factory.createOrganisatie(kvk_nummer=1)
    organisatie2 = organisatie_factory.createOrganisatie(kvk_nummer=2)
    response = client.get(f'/organisaties/{organisatie1.kvk_nummer}/')
    assert response.status_code == 200
    assert response.json["data"] == organisatie1.to_dict()
    response = client.get(f'/organisaties/{organisatie2.kvk_nummer}/')
    assert response.status_code == 200
    assert response.json["data"] == organisatie2.to_dict()
    response = client.get(f'/organisaties/1337/')
    assert response.status_code == 404
    assert response.json["errors"] == ["Organisatie not found."]

def test_organisaties_get_filter_kvks(client, organisatie_factory):
    """ Test filter_kvks on organisaties """
    organisatie1 = organisatie_factory.createOrganisatie(kvk_nummer=1)
    organisatie2 = organisatie_factory.createOrganisatie(kvk_nummer=2)
    response = client.get(f'/organisaties/?filter_kvks={organisatie1.kvk_nummer}')
    assert response.status_code == 200
    assert response.json["data"] == [organisatie1.to_dict()]
    response = client.get(f'/organisaties/?filter_kvks={organisatie1.kvk_nummer},{organisatie2.kvk_nummer}')
    assert response.status_code == 200
    assert response.json["data"] == [organisatie1.to_dict(), organisatie2.to_dict()]
    response = client.get('/organisaties/?filter_kvks=1337')
    assert response.status_code == 200
    assert response.json["data"] == []
    response = client.get('/organisaties/?filter_kvks=pietje')
    assert response.status_code == 400
    assert response.json["errors"] == ["Input for filter_kvks is not correct"]