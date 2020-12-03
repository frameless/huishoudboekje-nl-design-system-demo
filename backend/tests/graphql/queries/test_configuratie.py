import requests_mock
from hhb_backend.graphql import settings


def test_configuraties_success(client):
    with requests_mock.Mocker() as mock:
        adapter = mock.get(f"{settings.HHB_SERVICES_URL}/configuratie/", json={"data": [{"id": "ab_45", "waarde": "a@b.c"}]})
        response = client.post(
            "/graphql",
            data='{"query": "{ configuraties { id waarde }}"}',
            content_type='application/json'
        )

        assert adapter.called_once
        assert response.json == {'data': {'configuraties': [{'id': 'ab_45', 'waarde': 'a@b.c'}]}}


def test_configuratie_success(client):
    with requests_mock.Mocker() as mock:
        mock.get(f"{settings.HHB_SERVICES_URL}/configuratie/", json={"data": [{"id": "ab_45", "waarde": "a@b.c"}]})
        response = client.post(
            "/graphql",
            json={"query": '{ configuratie(id:"ab_45") { waarde }}'}
        )
        assert response.json == {'data': {'configuratie': {'waarde': 'a@b.c'}}}
