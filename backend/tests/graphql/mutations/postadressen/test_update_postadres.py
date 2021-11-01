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
        if request.path == "/addresses/test_id":
            return MockResponse({"id": 'test_id', "street": "test", "houseNumber": "test", "postalCode": "8888CC",
                                           "locality": "test"}, 200)
        elif request.path == "/gebruikersactiviteiten/":
            return MockResponse({'data': {'id': 1}}, 201)

    adapter.add_matcher(test_matcher)
    return adapter


def test_update_organisatie_success(client):
    with requests_mock.Mocker() as mock:
        mock._adapter = create_mock_adapter()

        response = client.post(
            "/graphql",
            json={
                "query": '''
                mutation updatePostadres($id: String!,
                $huisnummer: String,
                $plaatsnaam: String,
                $straatnaam: String,
                $postcode: String) {
                  updatePostadres(id: $id, huisnummer: $huisnummer, plaatsnaam: $plaatsnaam, straatnaam: $straatnaam, postcode: $postcode) {
                    ok
                    postadres {
                      id
                    }
                  }
                }''',
                "variables": {"id": "test_id",
                              "huisnummer": "52B",
                              "plaatsnaam": "testplaats",
                              "straatnaam": "teststraat",
                              "postcode": "9999ZZ"}},
        )

        assert response.json == {"data": {"updatePostadres": {"ok": True, "postadres": {"id": "test_id"}}}}
        assert mock._adapter.call_count == 3
