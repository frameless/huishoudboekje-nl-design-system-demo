""" Test DELETE /afdelingen/(<afdeling_id>/) """
from models.afdeling import Afdeling


def test_afdelingen_delete_success(client, dbsession, afdeling_factory):
    """ Test a succesfull DELETE on afdelingen """
    afdeling = afdeling_factory.createafdeling()
    assert dbsession.query(afdeling).count() == 1
    response = client.delete(f'/afdelingen/{afdeling.id}')
    assert response.status_code == 204
    assert dbsession.query(afdeling).count() == 0


def test_afdelingen_delete_bad_request(client):
    """ Test 405 error for DELETE on afdelingen """
    response = client.delete('/afdelingen/')
    assert response.status_code == 405


def test_afdelingen_delete_afdeling_not_found(client):
    """ Test 404 error for DELETE on afdelingen """
    response = client.delete('/afdelingen/1337')
    assert response.status_code == 404