""" Test DELETE /organisaties/(<organisatie_id>/) """
from models.organisatie import Organisatie

def test_organisaties_delete_success(client, dbsession, organisatie_factory):
    """ Test a succesfull DELETE on organisaties """
    organisatie = organisatie_factory.createOrganisatie()
    assert dbsession.query(Organisatie).count() == 1
    response = client.delete(f'/organisaties/{organisatie.id}')
    assert response.status_code == 204
    assert dbsession.query(Organisatie).count() == 0

def test_organisaties_delete_bad_request(client):
    """ Test 405 error for DELETE on organisaties """
    response = client.delete('/organisaties/')
    assert response.status_code == 405
    
def test_organisaties_delete_organisatie_not_found(client):
    """ Test 404 error for DELETE on organisaties """
    response = client.delete('/organisaties/1337')
    assert response.status_code == 404