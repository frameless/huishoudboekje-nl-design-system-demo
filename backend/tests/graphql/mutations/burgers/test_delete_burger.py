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
        if request.path == "/afspraken/" and request.query == "filter_burgers=1":
            return MockResponse({'data': [{'id':1, 'burger_id': 1}]}, 200)
        elif request.path == "/afspraken/1":
            return MockResponse({'data': [{'id': 1, 'burger_id': 1}]}, 201)
        elif request.path == "/burgers/":
            return MockResponse({'data': [{'id': 1}]}, 200)
        elif request.path == "/gebruikersactiviteiten/":
            return MockResponse({'data': {'id': 1}}, 201)

    adapter.add_matcher(test_matcher)
    return adapter

def test_delete_burger(client):
    with requests_mock.Mocker() as mock:
        mock._adapter = create_mock_adapter()
        adapter = mock.delete(f"{settings.HHB_SERVICES_URL}/burgers/1", status_code=204)

        response = client.post(
            "/graphql",
            json={
                "query": '''
mutation test($id: Int!) {
  deleteBurger(id: $id) {
    ok
  }
}
''',
                "variables": {"id": 1}},
            content_type='application/json'
        )
        assert response.json == {"data": {
            "deleteBurger": {
                "ok": True,
            }
        }}
        assert adapter.called_once
        assert mock._adapter.call_count == 5


def test_delete_burger_error(client):
    with requests_mock.Mocker() as mock:
        adapter = mock.get(f"{settings.HHB_SERVICES_URL}/burgers/?filter_ids=1", status_code=200, json={"data": []})

        response = client.post(
            "/graphql",
            json={
                "query": '''
mutation test($id: Int!) {
  deleteBurger(id: $id) {
    ok
  }
}
''',
                "variables": {"id": 1}},
            content_type='application/json'
        )
        assert response.json == {"data": {"deleteBurger": None},
                                 "errors": [{"locations": [{"column": 3, "line": 3}],
                                             "message": "Burger with id 1 not found",
                                             "path": ["deleteBurger"]}]}
        assert adapter.called_once
