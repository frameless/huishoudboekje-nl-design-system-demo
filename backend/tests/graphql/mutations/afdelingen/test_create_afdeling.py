from requests.adapters import Response
import requests_mock
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
        if request.method == "GET" and request.path == "/organisaties/" and request.query == "filter_ids=1":
            return MockResponse({'data': [{'id': 1}]}, 200)

        elif request.method == "POST" and request.path == "/afdelingen/": #2 calls
            return MockResponse({'data': {'id': 1, }}, 201)

        elif request.method == "GET" and  request.path == "/rekeningen/" and request.query == "filter_ibans=gb33bukb20201555555555":
            return MockResponse({'data': [{'id': 1}]}, 200)

        elif request.method == "POST" and  request.path == "/afdelingen/1/rekeningen/":
            return MockResponse({'data': {'iban': 'GB33BUKB20201555555555', 'rekeninghouder': 'testrekeninghouder'}}, 201)

        elif request.method == "POST" and request.path == "/addresses":
            return MockResponse({'id': 'test_postadres_id_post',
                                 'houseNumber': '52B',
                                 'street': 'testStraat',
                                 'postalCode': '9999ZZ',
                                 'locality': 'testPlaats'}, 201)
                    
        elif request.path == "/afdelingen/1":
            return MockResponse({ 'data': { 'id': 1, 'postadressen_ids' : ['test_postadres_id_post']}}, 200)

        elif request.method == "GET" and  request.path == "/gebruikersactiviteiten/":
            return MockResponse({'data': {'id': 1}}, 201)

    adapter.add_matcher(test_matcher)
    return adapter

def test_create_afdeling_succes(client):
    with requests_mock.Mocker() as mock:
        mock._adapter = create_mock_adapter()
        
        response = client.post(
            "/graphql",
            json={
                "query": '''
        mutation test($input:CreateAfdelingInput!) {
            createAfdeling(input:$input) {
              ok
              afdeling {
                id
                }
            }
        }''',
                "variables": {"input": {
                    'organisatieId': 1,
                    'postadressen': [{
                        'straatnaam': 'testStraat',
                        'huisnummer': '52B',
                        'postcode': '9999ZZ',
                        'plaatsnaam': 'testplaats'
                    }],
                    'naam': 'testAfdeling',
                    'rekeningen': [{
                        'iban': 'GB33BUKB20201555555555',
                        'rekeninghouder': 'testrekeninghouder'
                    }]}}},
            content_type='application/json'
        )

        assert mock._adapter.call_count == 9
        assert response.json["data"]["createAfdeling"]["ok"] is True

def create_mock_adapter_new_rekening() -> Adapter:
    adapter = requests_mock.Adapter()

    def test_matcher(request):
        if request.path == "/organisaties/" and request.query == "filter_ids=1":
            return MockResponse({'data': [{'id': 1}]}, 200)
        
        elif request.path == "/afdelingen/": #1 organisatieservice #2 huishoudboekjeservice
            return MockResponse({'data': {'id': 1}}, 201)
        
        elif request.path == "/rekeningen/" and request.query == "filter_ibans=gb33bukb20201555555555":
            return MockResponse({'data': ""}, 200)

        elif request.path == "/rekeningen/":
            return MockResponse({'data': {'id': 10}}, 201)

        elif request.path == "/afdelingen/1/rekeningen/":
            return MockResponse({'data': "{'id': 1}"}, 201)

        elif request.path == "/addresses":
            return MockResponse({'id': 'test_postadres_id_post',
                                 'houseNumber': '52B',
                                 'street': 'testStraat',
                                 'postalCode': '9999ZZ',
                                 'locality': 'testPlaats'}, 201)

        elif request.path == "/afdelingen/1": #1 get #2 post
            return MockResponse({ 'data': { 'id': 1, 'postadressen_ids' : ['test_postadres_id_post']}}, 200)

        elif request.path == "/gebruikersactiviteiten/":
            return MockResponse({'data': {'id': 1}}, 201)

    adapter.add_matcher(test_matcher)
    return adapter

def test_create_afdeling_with_new_rekening_succes(client):
    with requests_mock.Mocker() as mock:
        mock._adapter = create_mock_adapter_new_rekening()

        response = client.post(
            "/graphql",
            json={
                "query": '''
        mutation test($input:CreateAfdelingInput!) {
            createAfdeling(input:$input) {
              ok
              afdeling {
                id
                }
            }
        }''',
                "variables": {"input": {
                    'organisatieId': 1,
                    'postadressen': [{
                        'straatnaam': 'testStraat',
                        'huisnummer': '52B',
                        'postcode': '9999ZZ',
                        'plaatsnaam': 'testplaats'
                    }],
                    'naam': 'testAfdeling',
                    'rekeningen': [{
                        'iban': 'GB33BUKB20201555555555',
                        'rekeninghouder': 'testrekeninghouder'
                    }]}}},
            content_type='application/json'
        )

        assert mock._adapter.call_count == 10
        assert response.json["data"]["createAfdeling"]["ok"] is True

def create_mock_adapter_new_rekening_invalid() -> Adapter:
    adapter = requests_mock.Adapter()

    def test_matcher(request):
        if request.path == "/afdelingen/":
            return MockResponse({'data': {'id': 1}}, 201)
        elif request.path == "/organisaties/" and request.query == "filter_ids=1":
            return MockResponse({'data': [{'id': 1}]}, 200)
        elif request.path == "/rekeningen/" and request.query == "filter_ibans=33bukb20201555555555":
            return MockResponse({'data': ""}, 200)
        elif request.path == "/afdelingen/1/rekeningen/":
            return MockResponse({'data': "{'id': 1}"}, 201)
        elif request.path == "/addresses":
            return MockResponse({'id': 'test_postadres_id_post',
                                 'houseNumber': '52B',
                                 'street': 'testStraat',
                                 'postalCode': '9999ZZ',
                                 'locality': 'testPlaats'}, 201)
        elif str(request) == "POST http://localhost:8001/afdelingen/1":
            return MockResponse({'data': {'id': 1}}, 200)
        elif request.path == "/afdelingen/1":
            return MockResponse({'data': {'id': 1, 'postadressen_ids': [{'id': 'test_postadres_id'}]}}, 201)
        elif request.path == "/gebruikersactiviteiten/":
            return MockResponse({'data': {'id': 1}}, 201)

    adapter.add_matcher(test_matcher)
    return adapter

def test_create_afdeling_with_new_rekening_invalid_succes(client):
    with requests_mock.Mocker() as mock:
        mock._adapter = create_mock_adapter_new_rekening_invalid()

        response = client.post(
            "/graphql",
            json={
                "query": '''
        mutation test($input:CreateAfdelingInput!) {
            createAfdeling(input:$input) {
              ok
              afdeling {
                id
                }
            }
        }''',
                "variables": {"input": {
                    'organisatieId': 1,
                    'postadressen': [{
                        'straatnaam': 'testStraat',
                        'huisnummer': '52B',
                        'postcode': '9999ZZ',
                        'plaatsnaam': 'testplaats'
                    }],
                    'naam': 'testAfdeling',
                    'rekeningen': [{
                        'iban': '33BUKB20201555555555',
                        'rekeninghouder': 'testrekeninghouder'
                    }]}}},
            content_type='application/json'
        )

        assert mock._adapter.call_count == 4
        assert response.json['errors'][0]['message'] == "Foutieve IBAN: 33BUKB20201555555555"