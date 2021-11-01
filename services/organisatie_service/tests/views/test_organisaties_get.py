""" Test GET /organisaties/(<organisatie_id>/) """
from models.organisatie import Organisatie

def test_organisaties_get_success_all(client, organisatie_factory):
    """ Test /organisaties/ path """
    organisatie1 = organisatie_factory.createOrganisatie(kvknummer="1")
    organisatie2 = organisatie_factory.createOrganisatie(kvknummer="2")
    response = client.get(f'/organisaties/')
    assert response.status_code == 200
    assert response.json["data"] == [organisatie1.to_dict(), organisatie2.to_dict()]

def test_organisaties_get_with_kvknummer(client, organisatie_factory):
    """ Test /organisaties/<kvknummer>/ path """
    organisatie1 = organisatie_factory.createOrganisatie(kvknummer="1")
    organisatie2 = organisatie_factory.createOrganisatie(kvknummer="2")
    response = client.get(f'/organisaties/{organisatie1.kvknummer}/')
    assert response.status_code == 200
    assert response.json["data"] == organisatie1.to_dict()
    response = client.get(f'/organisaties/{organisatie2.kvknummer}/')
    assert response.status_code == 200
    assert response.json["data"] == organisatie2.to_dict()
    response = client.get(f'/organisaties/1337/')
    assert response.status_code == 404
    assert response.json["errors"] == ["Organisatie not found."]

def test_organisaties_get_filter_ids(client, organisatie_factory):
    """ Test filter_ids on organisaties """
    organisatie1 = organisatie_factory.createOrganisatie(kvknummer="1")
    organisatie2 = organisatie_factory.createOrganisatie(kvknummer="2")
    response = client.get(f'/organisaties/?filter_ids={organisatie1.id}')
    assert response.status_code == 200
    assert response.json["data"] == [organisatie1.to_dict()]
    response = client.get(f'/organisaties/?filter_ids={organisatie1.id},{organisatie2.id}')
    assert response.status_code == 200
    assert response.json["data"] == [organisatie1.to_dict(), organisatie2.to_dict()]
    response = client.get('/organisaties/?filter_ids=3')
    assert response.status_code == 200
    assert response.json["data"] == []
