import json
import os

import requests_mock

ING_CSM_FILE = os.path.join(os.path.dirname(__file__), 'ING.txt')
ABN_CSM_FILE = os.path.join(os.path.dirname(__file__), 'ABN.txt')
BNG_CSM_FILE = os.path.join(os.path.dirname(__file__), 'BNG.txt')
INCORRECT_CSM_FILE = os.path.join(os.path.dirname(__file__), 'incorrect.txt')


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


def test_create_csm_with_ing_file(client):
    adapter = requests_mock.Adapter()

    def test_matcher(request):
        if request.path == "/customerstatementmessages/":
            assert request.json()["account_identification"] == "NL69INGB0123456789EUR"
            assert request.json()["closing_available_funds"] == 56435
            assert request.json()["closing_balance"] == 56435
            assert request.json()["forward_available_balance"] == 56435
            assert request.json()["opening_balance"] == 66223
            assert request.json()["transaction_reference_number"] == "P140220000000001"
            return MockResponse({'data': {'id': 1}}, 201)
        elif request.path == "/banktransactions/":
            return MockResponse({'data': {'id': 1}}, 201)

    adapter.add_matcher(test_matcher)

    with open(ING_CSM_FILE, "rb") as testfile:
        with requests_mock.Mocker() as m:
            m._adapter = adapter
            response = client.post(
                '/graphql/upload',
                data=create_data_post(testfile)
            )
            assert response.status_code == 200


def test_create_csm_with_abn_file(client):
    adapter = requests_mock.Adapter()

    def test_matcher(request):
        if request.path == "/customerstatementmessages/":
            assert request.json()["account_identification"] == "123456789"
            assert request.json()["transaction_reference_number"] == "ABN AMRO BANK NV"
            assert request.json()["sequence_number"] == "1"
            assert request.json()["opening_balance"] == 513861
            assert request.json()["closing_balance"] == 563862
            return MockResponse({'data': {'id': 1}}, 201)
        elif request.path == "/banktransactions/":
            return MockResponse({'data': {'id': 1}}, 201)

    adapter.add_matcher(test_matcher)

    with open(ABN_CSM_FILE, "rb") as testfile:
        with requests_mock.Mocker() as m:
            m._adapter = adapter
            response = client.post(
                '/graphql/upload',
                data=create_data_post(testfile)
            )
            assert response.status_code == 200


def test_create_csm_with_bng_file(client):
    adapter = requests_mock.Adapter()

    def test_matcher(request):
        if request.path == "/customerstatementmessages/":
            assert request.json()["account_identification"] == "0285053876"
            assert request.json()["transaction_reference_number"] == "34948929"
            assert request.json()["sequence_number"] == "1"
            assert request.json()["opening_balance"] == -2000000
            assert request.json()["closing_balance"] == 17060000
            return MockResponse({'data': {'id': 1}}, 201)
        elif request.path == "/banktransactions/":
            return MockResponse({'data': {'id': 1}}, 201)

    adapter.add_matcher(test_matcher)

    with open(BNG_CSM_FILE, "rb") as testfile:
        with requests_mock.Mocker() as m:
            m._adapter = adapter
            response = client.post(
                '/graphql/upload',
                data=create_data_post(testfile)
            )
            assert response.status_code == 200


def test_create_csm_with_incorrect_file(client):
    with open(INCORRECT_CSM_FILE, "rb") as testfile:
        response = client.post(
            '/graphql/upload',
            data=create_data_post(testfile)
        )
        assert response.json['errors'] is not None
        assert response.status_code == 200


def create_data_post(testfile):
    query = '''
        mutation testCSMCreate($file: Upload!) {
            createCustomerStatementMessage(file: $file) {
                ok
            }
        }
    '''
    return {
        'operations': json.dumps({
            'query': query,
            'variables': {
                'file': None,
            },
        }),
        't_file': testfile,
        'map': json.dumps({
            't_file': ['variables.file'],
        }),
    }
