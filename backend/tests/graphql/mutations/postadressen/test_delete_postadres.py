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
    with requests_mock.Mocker() as rm:
        # arrange
        expected = {"data": { "deletePostadres": { "ok": True,}}}
        postadres_existing = {"id": "test_id", "houseNumber": "52", "locality": "testplaats1", "street": "teststraat1", "postalCode": "9999AA"}
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.POSTADRESSEN_SERVICE_URL}/addresses/test_id", status_code=200, json=postadres_existing)
        rm2 = rm.delete(f"{settings.POSTADRESSEN_SERVICE_URL}/addresses/test_id", status_code=204)
        rm3 = rm.get(f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/?filter_ids=1", status_code=200, json={'data': [{'id': 1, 'postadressen_ids': ['test_id']}]})
        rm4 = rm.post(f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/1", status_code=200, json={'data': [{'id': 1}]})
        rm5 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_postadressen=test_id", status_code=200, json={'data': []})
        rm6 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=200)


        # act
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


        # assert
        assert rm1.called_once
        assert rm2.called_once
        assert rm3.called_once
        assert rm4.called_once
        assert rm5.called_once
        assert rm6.called_once
        assert fallback.call_count == 0
        assert response.json == expected

def test_delete_postadres_error_afspraken(client):
    with requests_mock.Mocker() as rm:
        # arrange
        expected = {"data": {"deletePostadres": None},
                                 "errors": [{"locations": [{"column": 37, "line": 4}],
                                             "message": "Postadres wordt gebruikt in een of meerdere afspraken - verwijderen is niet mogelijk.",
                                             "path": ["deletePostadres"]}]}
        postadres_existing = {"id": "test_id", "houseNumber": "52", "locality": "testplaats1", "street": "teststraat1", "postalCode": "9999AA"}
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.POSTADRESSEN_SERVICE_URL}/addresses/test_id", status_code=200, json=postadres_existing)
        rm2 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_postadressen=test_id", status_code=200, json={'data': [{'id': 1}]})


        # act
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


        # assert
        assert rm1.called_once
        assert rm2.called_once
        assert fallback.call_count == 0
        assert response.json == expected

def test_delete_postadres_error(client):
    with requests_mock.Mocker() as mock:
        adapter = mock.get(f"{settings.POSTADRESSEN_SERVICE_URL}/addresses/test_id", status_code=404, text="Not found")

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
