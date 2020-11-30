""" Test DELETE /gebruikers/<gebruikers_id> """
from models import Gebruiker, RekeningGebruiker


def test_gebruikers_detail_delete_success(client, session, gebruiker_factory):
    """ Test a succesfull DELETE on gebruikers_detail """
    gebruiker = gebruiker_factory.createGebruiker()
    assert session.query(Gebruiker).count() == 1
    response = client.delete(f'/gebruikers/{gebruiker.id}')
    assert response.status_code == 204
    assert session.query(Gebruiker).count() == 0

def test_gebruikers_delete_cascade_rekening_relation(client, session, rekening_gebruiker_factory):
    """ Test a succesfull DELETE on gebruiker with cascading rekening relation """
    rekening_gebruiker = rekening_gebruiker_factory.create_rekening_gebruiker()
    assert session.query(Gebruiker).count() == 1
    assert session.query(RekeningGebruiker).count() == 1
    response = client.delete(f'/gebruikers/{rekening_gebruiker.gebruiker.id}')
    assert response.status_code == 204
    assert session.query(Gebruiker).count() == 0
    assert session.query(RekeningGebruiker).count() == 0
