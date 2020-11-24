import requests_mock
from hhb_backend.graphql import settings


def test_gebruikers_success(client):
    with requests_mock.Mocker() as rm:
        adapter = rm.get(f"{settings.HHB_SERVICES_URL}/gebruikers/", json={"data": [{"id": 1, "email": "a@b.c"}]})
        response = client.post(
            "/graphql",
            data='{"query": "{ gebruikers { email }}"}',
            content_type='application/json'
        )

        assert adapter.called_once
        assert response.json == {'data': {'gebruikers': [{'email': 'a@b.c'}]}}


def test_gebruiker_success(client):
    with requests_mock.Mocker() as rm:
        rm.get(f"{settings.HHB_SERVICES_URL}/gebruikers/", json={'data': [{'id': 1, 'email': 'a@b.c'}]})
        response = client.post(
            "/graphql",
            data='{"query": "{ gebruiker(id:1) { email }}"}',
            content_type='application/json'
        )
        assert response.json == {'data': {'gebruiker': {'email': 'a@b.c'}}}

def test_gebruiker_afspraken(client):
    with requests_mock.Mocker() as rm:
        rm.get(f"{settings.HHB_SERVICES_URL}/gebruikers/", json={'data': [{'id': 1, 'afspraken': [1]}]})
        rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/", json={'data': [{'id': 1, "gebruiker_id": 1}]})
        response = client.post(
            "/graphql",
            data='{"query": "{ gebruiker(id:1) { afspraken { id } } }"}',
            content_type='application/json'
        )
        assert response.json == {'data': {'gebruiker': {'afspraken': [{'id': 1}]}}}

def test_gebruiker_rekeningen(client):
    with requests_mock.Mocker() as rm:
        rm.get(f"{settings.HHB_SERVICES_URL}/gebruikers/", json={'data': [{'id': 1, 'rekeningen': [1]}]})
        rm.get(f"{settings.HHB_SERVICES_URL}/rekeningen/", json={'data': [{'id': 1, "gebruikers": [1]}]})
        response = client.post(
            "/graphql",
            data='{"query": "{ gebruiker(id:1) { rekeningen { id } } }"}',
            content_type='application/json'
        )
        assert response.json == {'data': {'gebruiker': {'rekeningen': [{'id': 1}]}}}