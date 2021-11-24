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
    with requests_mock.Mocker() as rm:
        # arrange
        expected = {"data": {"updatePostadres": {"ok": True, "postadres": {"id": "test_id"}}}}
        postadres_input = {"id": "test_id", "huisnummer": "52B", "plaatsnaam": "testplaats", "straatnaam": "teststraat", "postcode": "9999ZZ"}
        
        postadres ={"id": "test_id", "houseNumber": "52", "locality": "testplaats1", "street": "teststraat1", "postalCode": "9999AA"}
        postadres_updated={"id": "test_id", "houseNumber": "52B", "locality": "testplaats", "street": "teststraat", "postalCode": "9999ZZ"}

        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.POSTADRESSEN_SERVICE_URL}/addresses/test_id", status_code=200, json=postadres)
        rm2 = rm.put(f"{settings.POSTADRESSEN_SERVICE_URL}/addresses/test_id", status_code=200, json=postadres_updated)
        rm3 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=200)


        # act
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
                "variables": postadres_input},
        )


        # assert 
        assert rm1.called_once
        assert rm2.called_once
        assert rm3.called_once
        assert fallback.call_count == 0
        assert response.json == expected
