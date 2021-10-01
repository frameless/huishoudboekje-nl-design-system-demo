import re

import pytest
import requests_mock
from hhb_backend.graphql import settings
from requests_mock import Adapter

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

def create_mock_adapter() -> Adapter:
    adapter = requests_mock.Adapter()

    def test_matcher(request):
        if request.path == "/organisaties/" and request.query == "filter_ids=1":
            return MockResponse({'data': [{'id': 1}]}, 200)
        elif request.path == "/organisaties/1":
            return MockResponse({'data': [{'id': 1}]}, 201)
        elif request.path == "/gebruikersactiviteiten/":
            return MockResponse({'data': {'id': 1}}, 201)
        elif request.path == "/afdelingen/" and request.query == "filter_organisaties=1":
            return MockResponse({'data': [{'id': 1, 'organisatie_id': 1, 'postadressen_ids': [{'id': 'test_postadres_id'}]}]}, 200)
        elif request.path == "/addresses/test_postadres_id":
            return MockResponse({'id': 'test_postadres_id'}, 204)
        elif request.path == "/afdelingen/1":
            return MockResponse({'id': 1}, 204)

    adapter.add_matcher(test_matcher)
    return adapter

def test_delete_organisatie(client):
    with requests_mock.Mocker() as mock:
        mock._adapter = create_mock_adapter()
        adapter = mock.delete(f"{settings.ORGANISATIE_SERVICES_URL}/organisaties/1", status_code=204)

        response = client.post(
            "/graphql",
            json={
                "query": '''
mutation test($id: Int!) {
  deleteOrganisatie(id: $id) {
    ok
  }
}
''',
                "variables": {"id": 1}},
            content_type='application/json'
        )
        assert response.json == {"data": {
            "deleteOrganisatie": {
                "ok": True,
            }
        }}

        assert adapter.called_once
        assert mock._adapter.call_count == 7

def test_delete_organisatie_error(client):
    with requests_mock.Mocker() as mock:
        adapter = mock.get(f"{settings.ORGANISATIE_SERVICES_URL}/organisaties/?filter_ids=1", status_code=404, text="Not found")

        response = client.post(
            "/graphql",
            json={
                "query": '''
mutation test($id: Int!) {
  deleteOrganisatie(id: $id) {
    ok
  }
}
''',
                "variables": {"id": 1}},
            content_type='application/json'
        )
        assert response.json == {"data": {"deleteOrganisatie": None},
                                 "errors": [{"locations": [{"column": 3, "line": 3}],
                                             "message": "Upstream API responded: Not found",
                                             "path": ["deleteOrganisatie"]}]}
        assert adapter.called_once
