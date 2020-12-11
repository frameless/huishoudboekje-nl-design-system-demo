import requests_mock

from hhb_backend.graphql import settings


def test_export(client):
    with requests_mock.Mocker() as rm:
        rm.get(f"{settings.HHB_SERVICES_URL}/export/", json={'data': [{
            'id': 1,
        }]})
        response = client.post(
            "/graphql",
            data='{"query": "{ exports { id } }"}',
            content_type='application/json'
        )
        assert response.json == {'data': {
            'exports': [{
                'id': 1,
            }]
        }}
