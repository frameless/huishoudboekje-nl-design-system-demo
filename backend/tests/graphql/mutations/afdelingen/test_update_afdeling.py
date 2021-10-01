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
            return MockResponse({'data': [{"id": 1, "organisatie_id": 1}]}, 200)
        elif request.path == "/afdelingen/":
            return MockResponse({'data': [{'id': 1}]}, 201)
        elif request.path == "/afdelingen/1":
            return MockResponse({'data': {'id': 1}}, 200)
        elif request.path == "/gebruikersactiviteiten/":
            return MockResponse({'data': {'id': 1}}, 201)

    adapter.add_matcher(test_matcher)
    return adapter


def test_update_afdeling_success(client):
    with requests_mock.Mocker() as mock:
        mock._adapter = create_mock_adapter()

        response = client.post(
            "/graphql",
            json={
                "query": '''
                mutation updateAfdeling($id: Int!,
                $naam: String,
                $organisatie_id: Int) {
                  updateAfdeling(id: $id, organisatieId: $organisatie_id, naam: $naam) {
                    ok
                    afdeling {
                      id
                    }
                  }
                }''',
                "variables": {"id": 1,
                              "organisatie_id": 1,
                              "naam": "test_organisatie"}},
        )
        print(response.json)

        assert response.json == {"data": {"updateAfdeling": {"ok": True, "afdeling": {"id": 1}}}}
        assert mock._adapter.call_count == 4