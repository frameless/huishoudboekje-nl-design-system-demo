""" Test DELETE /rekeningen/(<rekening_id>/) """
from models.rekening import Rekening


def test_rekeningen_delete_success(client, session, rekening_factory):
    """ Test a succesfull DELETE on rekeningen """
    rekening = rekening_factory.create_rekening()
    assert session.query(Rekening).count() == 1
    response = client.delete(f'/rekeningen/{rekening.id}')
    assert response.status_code == 202
    assert session.query(Rekening).count() == 0


def test_rekeningen_delete_bad_request(client):
    """ Test 400 error for DELETE on rekeningen """
    response = client.delete('/rekeningen/')
    assert response.status_code == 400


def test_rekeningen_delete_rekening_not_found(client):
    """ Test 404 error for DELETE on rekeningen """
    response = client.delete('/rekeningen/1337')
    assert response.status_code == 404