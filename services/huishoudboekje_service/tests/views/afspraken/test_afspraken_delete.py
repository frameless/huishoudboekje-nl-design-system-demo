""" Test DELETE /afspraken/(<afspraak_id>/) """
from models.afspraak import Afspraak

def test_afspraken_delete_success(client, session, afspraak_factory):
    """ Test a succesfull DELETE on afspraken """
    afspraak = afspraak_factory.createAfspraak()
    assert session.query(Afspraak).count() == 1
    response = client.delete(f'/afspraken/{afspraak.id}')
    assert response.status_code == 204
    assert session.query(Afspraak).count() == 0

def test_afspraken_delete_method_not_allowed(client):
    """ Test 405 error for DELETE on organisaties """
    response = client.delete('/afspraken/')
    assert response.status_code == 405
    
def test_afspraken_delete_not_found(client):
    """ Test 404 error for DELETE on afspraken """
    response = client.delete('/afspraken/1337')
    assert response.status_code == 404