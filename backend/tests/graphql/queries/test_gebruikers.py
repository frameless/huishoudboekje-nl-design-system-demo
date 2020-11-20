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
