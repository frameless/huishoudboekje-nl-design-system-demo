""" Test GET /afdelingen/(<afdeling_id>/) """
from models.afdeling import Afdeling

def test_afdelingen_get_success_all(client, dbsession, afdeling_factory):
    """ Test /afdelingen/ path """
    afdeling1 = afdeling_factory.createAfdeling()
    afdeling2 = afdeling_factory.createAfdeling()

    response = client.get(f'/afdelingen/')
    responseJson = response.json["data"]
    responseJson.remove('uuid')
    assert response.status_code == 200
    assert dbsession.query(Afdeling).count() == 2
    assert responseJson == [afdeling1.to_dict(), afdeling2.to_dict()]


def test_afdelingen_get_filter_ids(client, dbsession, afdeling_factory):
    """ Test filter_ids on afdelingen """
    afdeling1 = afdeling_factory.createAfdeling()
    afdeling2 = afdeling_factory.createAfdeling()
    assert dbsession.query(Afdeling).count() == 2

    response = client.get(f'/afdelingen/?filter_ids={afdeling1.id}')
    assert response.status_code == 200
    assert response.json["data"] == [afdeling1.to_dict()]

    response = client.get(f'/afdelingen/?filter_ids={afdeling1.id},{afdeling2.id}')
    assert response.status_code == 200
    assert response.json["data"] == [afdeling1.to_dict(), afdeling2.to_dict()]

