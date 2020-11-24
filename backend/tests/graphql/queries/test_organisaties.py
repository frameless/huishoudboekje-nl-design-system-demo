import requests_mock
from hhb_backend.graphql import settings

def test_organisatie_rekeningen(client):
    with requests_mock.Mocker() as rm:
        rm.get(f"{settings.HHB_SERVICES_URL}/organisaties/", json={'data': [{'id': 1, 'rekeningen': [1]}]})
        rm.get(f"{settings.HHB_SERVICES_URL}/rekeningen/", json={'data': [{'id': 1, "organisaties": [1]}]})
        response = client.post(
            "/graphql",
            data='{"query": "{ organisatie(id:1) { rekeningen { id } } }"}',
            content_type='application/json'
        )
        assert response.json == {'data': {'organisatie': {'rekeningen': [{'id': 1}]}}}