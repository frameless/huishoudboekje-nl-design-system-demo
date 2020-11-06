import requests
import requests_mock
import mock
import json
from hhb_backend.graphql import settings
import pytest

class MockResponse():
    history = None
    raw = None
    is_redirect = None
    content = None

    def __init__(self, json_data, status_code):
        self.json_data = json_data
        self.status_code = status_code

    def json(self):
        return self.json_data

def test_create_afspraak_success(client):
    adapter = requests_mock.Adapter()
    def test_matcher(request):
        assert request.json() == {"gebruiker_id": 1, "interval": "P1Y2M3W4D"}
        return MockResponse({'data': [{'id': 1}]}, 201)
    adapter.add_matcher(test_matcher)
    with requests_mock.Mocker() as m:
        m._adapter = adapter
        response = client.post(
            "/graphql",
            data='{"query": "mutation { createAfspraak( gebruikerId: 1, interval: { jaren: 1, maanden: 2, weken: 3, dagen: 4 } ) { ok } }"}',
            content_type='application/json'
        )
        assert response.json["data"]["createAfspraak"]["ok"] == True