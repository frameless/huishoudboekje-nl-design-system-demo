""" Test DELETE /grootboekrekeningen/(<grootboekrekening_id>/) """
from models import Grootboekrekening

def test_grootboek_delete_success(client, dbsession, grootboekrekening_factory):
    """ Test a succesfull DELETE on grootboekrekeningen """
    grootboek = grootboekrekening_factory.create_grootboekrekening("1")
    assert dbsession.query(Grootboekrekening).count() == 1
    response = client.delete(f'/grootboekrekeningen/{grootboek.id}')
    assert response.status_code == 204
    assert dbsession.query(Grootboekrekening).count() == 0


def test_grootboek_delete_bad_request(client):
    """ Test 405 error for DELETE on grootboekrekeningen """
    response = client.delete('/grootboekrekeningen/')
    assert response.status_code == 405


def test_grootboek_delete_grootboek_not_found(client):
    """ Test 404 error for DELETE on grootboekrekeningen """
    response = client.delete('/grootboekrekeningen/1337')
    assert response.status_code == 404

def test_grootboek_delete_invalid_id(client):
    """ Test 400 error for DELETE on grootboekrekeningen """
    response = client.delete('/grootboekrekeningen/NaN')
    assert response.status_code == 400
