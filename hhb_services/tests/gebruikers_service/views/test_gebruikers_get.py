import pytest
#from hhb_models import Gebruiker

def test_gebruikers_get_empty_db(app):
    """Start with a blank database."""
    response = app.test_client().get('/gebruikers/')
    assert {'data': []} == response.json

def test_gebruikers_get_single_gebruiker(app):
    """Start with a blank database."""
    client = app.test_client()
    response = client.post('/gebruikers/', data='{"email": "a@b.c", "telefoonnummer": "1234", "geboortedatum": "2020-01-01"}', content_type='application/json')
    print("--")
    print(response.json)
    print("--")
    response = client.get('/gebruikers/')
    print(response.json)
    print("--")
    assert "a@b.c" == response.json["data"][0]["email"]

def test_gebruikers_get_single_gebruiker_tmp(app):
    """Start with a blank database."""
    client = app.test_client()
    response = client.post('/gebruikers/', data='{"email": "c@b.a", "telefoonnummer": "1234", "geboortedatum": "2020-01-01"}', content_type='application/json')
    print("--")
    print(response.json)
    print("--")
    response = client.get('/gebruikers/')
    print(response.json)
    print("--")
    assert "c@b.a" == response.json["data"][0]["email"]
