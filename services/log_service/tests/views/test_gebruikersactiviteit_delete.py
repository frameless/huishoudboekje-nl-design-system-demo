""" Test DELETE /gebruikersactiviteiten/(<gebruikersactiviteit_id>/) """
from models import GebruikersActiviteit


def test_gebruikersactiviteit_delete_success(client, dbsession, gebruikersactiviteit_factory):
    """ Test a succesfull DELETE on gebruikersactiviteiten """
    ga1 = gebruikersactiviteit_factory.create_gebruikersactiviteit()
    assert dbsession.query(GebruikersActiviteit).count() == 1
    response = client.delete(f'/gebruikersactiviteiten/{ga1.id}')
    assert response.status_code == 204
    assert dbsession.query(GebruikersActiviteit).count() == 0


def test_gebruikersactiviteit_delete_bad_request(client):
    """ Test 400 error for DELETE on gebruikersactiviteiten """
    response = client.delete('/gebruikersactiviteiten/')
    assert response.status_code == 405


def test_gebruikersactiviteit_delete_gebruikersactiveit_not_found(client):
    """ Test 404 error for DELETE on gebruikersactiviteiten """
    response = client.delete('/gebruikersactiviteiten/1337')
    assert response.status_code == 404
