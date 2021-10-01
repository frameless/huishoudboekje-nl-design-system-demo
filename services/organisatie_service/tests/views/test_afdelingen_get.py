""" Test GET /afdelingen/(<afdeling_id>/) """
from models.afdeling import Afdeling

def test_afdelingen_get_success_all(client, afdeling_factory):
    """ Test /afdelingen/ path """
    afdeling1 = afdeling_factory.createafdeling(organisatie_id=1)
    afdeling2 = afdeling_factory.createafdeling(organisatie_id=2)
    response = client.get(f'/afdelingen/')
    assert response.status_code == 200
    assert response.json["data"] == [afdeling1.to_dict(), afdeling2.to_dict()]


def test_afdelingen_get_filter_ids(client, afdeling_factory):
    """ Test filter_ids on afdelingen """
    afdeling1 = afdeling_factory.createafdeling(organisatie_id=1)
    afdeling2 = afdeling_factory.createafdeling(organisatie_id=2)
    response = client.get(f'/afdelingen/?filter_ids={afdeling1.id}')
    assert response.status_code == 200
    assert response.json["data"] == [afdeling1.to_dict()]
    response = client.get(f'/afdelingen/?filter_ids={afdeling1.id},{afdeling2.id}')
    assert response.status_code == 200
    assert response.json["data"] == [afdeling1.to_dict(), afdeling2.to_dict()]
    response = client.get('/afdelingen/?filter_ids=3')
    assert response.status_code == 200
    assert response.json["data"] == []
