""" Test DELETE /organisaties/(<organisatie_id>/) """
from models import Organisatie, RekeningOrganisatie

def test_organisaties_delete_success(client, session, organisatie_factory):
    """ Test a succesfull DELETE on organisaties """
    organisatie = organisatie_factory.createOrganisatie()
    assert session.query(Organisatie).count() == 1
    response = client.delete(f'/organisaties/{organisatie.id}')
    assert response.status_code == 204
    assert session.query(Organisatie).count() == 0

def test_organisaties_delete_bad_request(client):
    """ Test 400 error for DELETE on organisaties """
    response = client.delete('/organisaties/')
    assert response.status_code == 405
    
def test_organisaties_delete_organisatie_not_found(client):
    """ Test 404 error for DELETE on organisaties """
    response = client.delete('/organisaties/1337')
    assert response.status_code == 404

def test_organisaties_delete_cascade_rekening_relation(client, session, rekening_organisatie_factory):
    """ Test a succesfull DELETE on organisatie with cascading rekening relation """
    rekening_organisatie = rekening_organisatie_factory.create_rekening_organisatie()
    assert session.query(Organisatie).count() == 1
    assert session.query(RekeningOrganisatie).count() == 1
    response = client.delete(f'/organisaties/{rekening_organisatie.organisatie.id}')
    assert response.status_code == 204
    assert session.query(Organisatie).count() == 0
    assert session.query(RekeningOrganisatie).count() == 0
