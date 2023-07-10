""" Test GET /afdelingen/(<afdeling_id>/) """
from models.afdeling import Afdeling

def test_afdelingen_get_success_all(client, dbsession, afdeling_factory):
    """ Test /afdelingen/ path """
    afdeling1 = afdeling_factory.createAfdeling().to_dict()
    afdeling2 = afdeling_factory.createAfdeling().to_dict()

    afdeling1.pop('uuid')
    afdeling2.pop('uuid')

    responseJson = []

    response = client.get(f'/afdelingen/')

    assert response.status_code == 200
    assert dbsession.query(Afdeling).count() == 2

    for afdeling in response.json["data"]:
        afdeling.pop('uuid')
        responseJson.append(afdeling)

    assert responseJson == [afdeling1, afdeling2]


def test_afdelingen_get_filter_ids(client, dbsession, afdeling_factory):
    """ Test filter_ids on afdelingen """
    afdeling1 = afdeling_factory.createAfdeling().to_dict()
    afdeling2 = afdeling_factory.createAfdeling().to_dict()
    afdeling1.pop('uuid')
    afdeling2.pop('uuid')

    assert dbsession.query(Afdeling).count() == 2

    response = client.get(f'/afdelingen/?filter_ids={afdeling1["id"]}')

    assert response.status_code == 200

    responseJson = []

    for afdeling in response.json["data"]:
        afdeling.pop('uuid')
        responseJson.append(afdeling)

    assert responseJson == [afdeling1]

    response = client.get(f'/afdelingen/?filter_ids={afdeling1["id"]},{afdeling2["id"]}')

    assert response.status_code == 200

    responseJson = []

    for afdeling in response.json["data"]:
        afdeling.pop('uuid')
        responseJson.append(afdeling)

    assert responseJson == [afdeling1, afdeling2]

