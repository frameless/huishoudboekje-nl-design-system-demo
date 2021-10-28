import requests_mock
from requests_mock import Adapter
from hhb_backend.graphql import settings

import logging

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
        logging.getLogger(f"wouter-logger").warning(f"[{request}] || {request.method} {request.path} {request.query}")
        if request.method == "GET" and request.path == "/organisaties/" and request.query == "filter_ids=1":
            return MockResponse({'data': [{"id": 1, "kvknummer": "123456789", "vestigingsnummer": "012345678912", "naam": "test_organisatie"}]}, 200)
        elif request.method == "GET" and request.path == "/organisaties/":
            return MockResponse({'data': [{'id': 1}]}, 201)
        elif request.method == "POST" and  request.path == "/organisaties/1":
            return MockResponse({'data': {'id': 1}}, 200)
        elif request.method == "POST" and request.path == "/gebruikersactiviteiten/":
            return MockResponse({'data': {'id': 1}}, 201)

    adapter.add_matcher(test_matcher)
    return adapter


def test_update_organisatie_success(client):
    with requests_mock.Mocker() as mock:
        mock._adapter = create_mock_adapter()
        organisatie_to_update = {"id": 1, "kvknummer": "123456789", "vestigingsnummer": "012345678912", "naam": "test_organisatie"}

        # TODO make this work        
        # fallback = mock.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        # org_1 = mock.get(f"{settings.ORGANISATIE_SERVICES_URL}/organisaties/?filter_ids=1", status_code=200, json={'data': [{"id": 1, "kvknummer": "123456789", "vestigingsnummer": "012345678912", "naam": "test_organisatie"}]})
        # org_2 = mock.get(f"{settings.ORGANISATIE_SERVICES_URL}/organisaties/", status_code=201, json={'data': [{'id': 1}]})
        # org_3 = mock.post(f"http://organisatieservice:8000/organisaties/1", status_code=200, json={'data': {'id': 1}})
        # act_1 = mock.post(f"http://logservice:8000/gebruikersactiviteiten/", status_code=201, json={'data': {'id': 1}})

        #actual calls made
        # [GET http://organisatieservice:8000/organisaties/?filter_ids=1] || GET /organisaties/ filter_ids=1
        # [GET http://organisatieservice:8000/organisaties/] || GET /organisaties/
        # [POST http://organisatieservice:8000/organisaties/1] || POST /organisaties/1
        # [POST http://logservice:8000/gebruikersactiviteiten/] || POST /gebruikersactiviteiten/

        response = client.post(
            "/graphql",
            json={
                "query": '''
                mutation updateOrganisatie($id: Int!,
                $kvknummer: String,
                $vestigingsnummer: String,
                $naam: String) {
                  updateOrganisatie(id: $id, kvknummer: $kvknummer, vestigingsnummer: $vestigingsnummer, naam: $naam) {
                    ok
                    organisatie {
                      id
                    }
                  }
                }''',
                "variables": organisatie_to_update},
        )

        assert response.json == {"data": {"updateOrganisatie": {"ok": True, "organisatie": {"id": 1}}}}

        assert org_1.called_once
        # assert org_2.called_once
        # assert org_3.called_once
        # assert act_1.called_once

        assert mock._adapter.call_count == 5


def create_mock_adapter2() -> Adapter:
    adapter = requests_mock.Adapter()

    def test_matcher(request):
        if request.path == "/organisaties/" and request.query == "filter_ids=1":
            return MockResponse({'data': [{"id": 1, "kvknummer": "123456789", "vestigingsnummer": "012345678912", "naam": "test_organisatie"}]}, 200)
        if request.path == "/organisaties/":
            return MockResponse({'data': [{'id': 1, 'kvknummer': "123", 'vestigingsnummer': "123"},
                                          {'id': 2, 'kvknummer': "123", 'vestigingsnummer': "123"}]}, 201)
        elif request.path == "/organisaties/1":
            return MockResponse({'data': {'id': 1}}, 200)
        elif request.path == "/gebruikersactiviteiten/":
            return MockResponse({'data': {'id': 1}}, 201)

    adapter.add_matcher(test_matcher)
    return adapter


def test_update_organisatie_unique_fail(client):
    with requests_mock.Mocker() as mock:
        mock._adapter = create_mock_adapter2()

        response = client.post(
            "/graphql",
            json={
                "query": '''
        mutation updateOrganisatie($id: Int!, $kvknummer: String, $vestigingsnummer: String,$naam: String) 
        { updateOrganisatie(id: $id, kvknummer: $kvknummer, vestigingsnummer: $vestigingsnummer, naam: $naam)  {
              ok
              organisatie {
                id
                }
            }
        }''',
                "variables": {
                    'id': 1,
                    'kvknummer': '123',
                    'vestigingsnummer': '123',
                    'naam': 'testOrganisatie'}},
            content_type='application/json'
        )

        assert mock._adapter.call_count == 2
        assert response.json["errors"][0]["message"] == "Combination kvk-nummer and vestigingsnummer is not unique."
