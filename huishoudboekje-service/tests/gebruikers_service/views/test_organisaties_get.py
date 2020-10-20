""" Test GET /organisaties/(<organisatie_id>/) """
from models.organisatie import Organisatie

def test_organisaties_get_success_all(client, organisatie_factory):
    """ Test /organisaties/ path """
    organisatie1 = organisatie_factory.createOrganisatie(kvk_nummer=1, weergave_naam="Test Bedrijf 1")
    organisatie2 = organisatie_factory.createOrganisatie(kvk_nummer=2, weergave_naam="Test Bedrijf 2")
    response = client.get(f'/organisaties/')
    assert response.status_code == 200
    assert response.json["data"] == [organisatie1.to_dict(), organisatie2.to_dict()]

def test_organisaties_get_with_id(client, organisatie_factory):
    """ Test /organisaties/<organisatie_id>/ path """
    organisatie1 = organisatie_factory.createOrganisatie(kvk_nummer=1, weergave_naam="Test Bedrijf 1")
    organisatie2 = organisatie_factory.createOrganisatie(kvk_nummer=2, weergave_naam="Test Bedrijf 2")
    response = client.get(f'/organisaties/{organisatie1.id}/')
    assert response.status_code == 200
    assert response.json["data"] == organisatie1.to_dict()
    response = client.get(f'/organisaties/{organisatie2.id}/')
    assert response.status_code == 200
    assert response.json["data"] == organisatie2.to_dict()
    response = client.get(f'/organisaties/1337/')
    assert response.status_code == 404
    assert response.json["errors"] == ["Organisatie not found."]

def test_organisaties_get_filter_ids(client, organisatie_factory):
    """ Test filter_ids on organisaties """
    organisatie1 = organisatie_factory.createOrganisatie(kvk_nummer=1, weergave_naam="Test Bedrijf 1")
    organisatie2 = organisatie_factory.createOrganisatie(kvk_nummer=2, weergave_naam="Test Bedrijf 2")
    response = client.get(f'/organisaties/?filter_ids={organisatie1.id}')
    assert response.status_code == 200
    assert response.json["data"] == [organisatie1.to_dict()]
    response = client.get(f'/organisaties/?filter_ids={organisatie1.id},{organisatie2.id}')
    assert response.status_code == 200
    assert response.json["data"] == [organisatie1.to_dict(), organisatie2.to_dict()]
    response = client.get('/organisaties/?filter_ids=1337')
    assert response.status_code == 200
    assert response.json["data"] == []
    response = client.get('/organisaties/?filter_ids=pietje')
    assert response.status_code == 400
    assert response.json["errors"] == ["Input for filter_ids is not correct"]

def test_organisaties_get_filter_kvks(client, organisatie_factory):
    """ Test filter_kvks on organisaties """
    organisatie1 = organisatie_factory.createOrganisatie(kvk_nummer="1", weergave_naam="Test Bedrijf 1")
    organisatie2 = organisatie_factory.createOrganisatie(kvk_nummer="2", weergave_naam="Test Bedrijf 2")
    response = client.get(f'/organisaties/?filter_kvks={organisatie1.kvk_nummer}')
    assert response.status_code == 200
    assert response.json["data"] == [organisatie1.to_dict()]
    response = client.get(f'/organisaties/?filter_kvks={organisatie1.kvk_nummer},{organisatie2.kvk_nummer}')
    assert response.status_code == 200
    assert response.json["data"] == [organisatie1.to_dict(), organisatie2.to_dict()]
    response = client.get('/organisaties/?filter_kvks=1337')
    assert response.status_code == 200
    assert response.json["data"] == []
