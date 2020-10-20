""" Test DELETE /gebruikers/<gebruikers_id> """
from models import Gebruiker


def test_gebruikers_detail_get_success(client, session, gebruiker_factory):
    """ Test a succesfull DELETE on gebruikers_detail """
    gebruiker = gebruiker_factory.createGebruiker()
    assert session.query(Gebruiker).count() == 1
    response = client.delete('/gebruikers/1')
    assert response.status_code == 204
    assert session.query(Gebruiker).count() == 0
