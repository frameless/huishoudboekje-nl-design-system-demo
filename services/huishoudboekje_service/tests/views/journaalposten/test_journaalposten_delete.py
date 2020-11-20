""" Test DELETE /journaalposten/(<journaalpost_id>/) """
from models.journaalpost import Journaalpost

def test_journaalposten_delete_success(client, session, journaalpost_factory):
    """ Test a succesfull DELETE on journaalposten """
    journaalpost = journaalpost_factory.create_journaalpost()
    assert session.query(Journaalpost).count() == 1
    response = client.delete(f'/journaalposten/{journaalpost.id}')
    assert response.status_code == 204
    assert session.query(Journaalpost).count() == 0

def test_journaalposten_delete_method_not_allowed(client):
    """ Test 405 error for DELETE on organisaties """
    response = client.delete('/journaalposten/')
    assert response.status_code == 405
    
def test_journaalposten_delete_not_found(client):
    """ Test 404 error for DELETE on journaalposten """
    response = client.delete('/journaalposten/1337')
    assert response.status_code == 404