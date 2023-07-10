""" Test GET /organisaties/(<organisatie_id>/) """
from models.organisatie import Organisatie

def test_organisaties_get_success_all(client, organisatie_factory):
    """ Test /organisaties/ path """
    organisatie1 = organisatie_factory.createOrganisatie(kvknummer="1").to_dict()
    organisatie2 = organisatie_factory.createOrganisatie(kvknummer="2").to_dict()

    response = client.get(f'/organisaties/')
    
    assert response.status_code == 200

    responseJson = []

    for organisatie in response.json["data"]:
        organisatie.pop('uuid')
        responseJson.append(organisatie)

    assert responseJson == [organisatie1, organisatie2]

def test_organisaties_get_with_kvknummer(client, organisatie_factory):
    """ Test /organisaties/<kvknummer>/ path """
    organisatie1 = organisatie_factory.createOrganisatie(kvknummer="1").to_dict()
    organisatie2 = organisatie_factory.createOrganisatie(kvknummer="2").to_dict()

    response = client.get(f'/organisaties/{organisatie1["kvknummer"]}/')

    assert response.status_code == 200

    resonseJson = response.json["data"]
    resonseJson.pop('uuid')
    assert resonseJson == organisatie1
    
    response = client.get(f'/organisaties/{organisatie2["kvknummer"]}/')
    
    assert response.status_code == 200

    resonseJson = response.json["data"]
    resonseJson.pop('uuid')
    assert resonseJson == organisatie2
    
    response = client.get(f'/organisaties/1337/')
    
    assert response.status_code == 404
    assert response.json["errors"] == ["Organisatie not found."]

def test_organisaties_get_filter_ids(client, organisatie_factory):
    """ Test filter_ids on organisaties """
    organisatie1 = organisatie_factory.createOrganisatie(kvknummer="1").to_dict()
    organisatie2 = organisatie_factory.createOrganisatie(kvknummer="2").to_dict()

    response = client.get(f'/organisaties/?filter_ids={organisatie1["id"]}')

    assert response.status_code == 200

    responseJson = []

    for organisatie in response.json["data"]:
        organisatie.pop('uuid')
        responseJson.append(organisatie)

    assert responseJson == [organisatie1]

    response = client.get(f'/organisaties/?filter_ids={organisatie1["id"]},{organisatie2["id"]}')
    
    assert response.status_code == 200

    responseJson = []

    for organisatie in response.json["data"]:
        organisatie.pop('uuid')
        responseJson.append(organisatie)

    assert responseJson == [organisatie1, organisatie2]
    
    response = client.get('/organisaties/?filter_ids=3')
    assert response.status_code == 200
    assert response.json["data"] == []
