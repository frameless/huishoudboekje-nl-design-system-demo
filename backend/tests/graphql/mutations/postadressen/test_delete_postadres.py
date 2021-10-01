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
        if request.path == "/afdelingen/" and request.query == "filter_ids=1":
            return MockResponse({'data': [{'id': 1, 'postadressen_ids': ['test_id']}]}, 200)
        elif request.path == "/addresses/test_id":
            return MockResponse({'id': 'test_id'}, 200)
        elif request.path == "/afdelingen/1":
            return MockResponse({'data': {'id': 1}}, 200)
        elif request.path == "/gebruikersactiviteiten/":
            return MockResponse({'data': {'id': 1}}, 201)


    adapter.add_matcher(test_matcher)
    return adapter

def test_delete_postadres(client):
    with requests_mock.Mocker() as mock:
        mock._adapter = create_mock_adapter()
        adapter = mock.delete(f"{settings.CONTACTCATALOGUS_SERVICE_URL}/addresses/test_id", status_code=204)

        response = client.post(
            "/graphql",
            json={
                "query": '''
mutation test($id: String!,
                $afdeling_id: Int!) {
  deletePostadres(id: $id, afdelingId: $afdeling_id) {
    ok
  }
}
''',
                "variables": {"id": "test_id",
                              "afdeling_id": 1}},
            content_type='application/json'
        )
        assert response.json == {"data": {
            "deletePostadres": {
                "ok": True,
            }
        }}

        assert adapter.called_once
        assert mock._adapter.call_count == 5

def test_delete_postadres_error(client):
    with requests_mock.Mocker() as mock:
        adapter = mock.get(f"{settings.CONTACTCATALOGUS_SERVICE_URL}/addresses/test_id", status_code=404, text="Not found")

        response = client.post(
            "/graphql",
            json={
                "query": '''
        mutation test($id: String!,
                        $afdeling_id: Int!) {
          deletePostadres(id: $id, afdelingId: $afdeling_id) {
            ok
          }
        }
        ''',
                "variables": {"id": "test_id",
                              "afdeling_id": 1}},
            content_type='application/json'
        )
        assert response.json == {"data": {"deletePostadres": None},
                                 "errors": [{"locations": [{"column": 11, "line": 4}],
                                             "message": "Upstream API responded: Not found",
                                             "path": ["deletePostadres"]}]}
        assert adapter.called_once
