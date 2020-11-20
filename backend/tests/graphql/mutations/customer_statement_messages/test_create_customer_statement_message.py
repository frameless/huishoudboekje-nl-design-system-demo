import json
import os

import requests_mock
from requests_mock import Adapter

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
    adapter = create_mock_adapter()

    with open(ING_CSM_FILE, "rb") as testfile:
        with requests_mock.Mocker() as m:
            m._adapter = adapter
            response = do_csm_post(client, testfile)
            # Customer Statement Message
            assert adapter.request_history[0].json()["account_identification"] == "NL69INGB0123456789EUR"
            assert adapter.request_history[0].json()["closing_available_funds"] == 56435
            assert adapter.request_history[0].json()["closing_balance"] == 56435
            assert adapter.request_history[0].json()["forward_available_balance"] == 56435
            assert adapter.request_history[0].json()["opening_balance"] == 66223
            assert adapter.request_history[0].json()["transaction_reference_number"] == "P140220000000001"
            # Bank transaction
            assert adapter.request_history[1].json()["tegen_rekening"] == 'NL32INGB0000012345'
            assert adapter.request_history[1].json()["bedrag"] == 156
            assert adapter.request_history[1].json()["transactie_datum"] == '2014-02-20'
            # Overall response
            assert adapter.call_count == 9
            assert response.json.get('errors', True)
            assert response.status_code == 200


def test_create_csm_with_abn_file(client):
    adapter = create_mock_adapter()

    with open(ABN_CSM_FILE, "rb") as testfile:
        with requests_mock.Mocker() as m:
            m._adapter = adapter
            response = do_csm_post(client, testfile)
            # Customer Statement Message
            assert adapter.request_history[0].json()["account_identification"] == "123456789"
            assert adapter.request_history[0].json()["transaction_reference_number"] == "ABN AMRO BANK NV"
            assert adapter.request_history[0].json()["sequence_number"] == "1"
            assert adapter.request_history[0].json()["opening_balance"] == 513861
            assert adapter.request_history[0].json()["closing_balance"] == 563862
            # Bank transaction
            assert adapter.request_history[1].json()["tegen_rekening"] == 'FR12345678901234'
            assert adapter.request_history[1].json()["bedrag"] == 50001
            assert adapter.request_history[1].json()["transactie_datum"] == '2012-05-12'
            # Overall response
            assert adapter.call_count == 2
            assert response.json.get('errors', True)
            assert response.status_code == 200


def test_create_csm_with_bng_file(client):
    adapter = create_mock_adapter()

    with open(BNG_CSM_FILE, "rb") as testfile:
        with requests_mock.Mocker() as m:
            m._adapter = adapter
            response = do_csm_post(client, testfile)
            # Customer Statement Message
            assert adapter.request_history[0].json()["account_identification"] == "0285053876"
            assert adapter.request_history[0].json()["transaction_reference_number"] == "34948929"
            assert adapter.request_history[0].json()["sequence_number"] == "1"
            assert adapter.request_history[0].json()["opening_balance"] == -2000000
            assert adapter.request_history[0].json()["closing_balance"] == 17060000
            # Bank transaction
            assert adapter.request_history[2].json()["tegen_rekening"] == 'DE37500700100925464001'
            assert adapter.request_history[1].json()["bedrag"] == -100000
            assert adapter.request_history[1].json()["transactie_datum"] == '2014-09-12'
            # Overall response
            assert adapter.call_count == 14
            assert response.json.get('errors', True)
            assert response.status_code == 200


def test_create_csm_with_incorrect_file(client):
    with open(INCORRECT_CSM_FILE, "rb") as testfile:
        response = do_csm_post(client, testfile)
        assert response.json['errors'] is not None
        assert response.status_code == 200


def create_mock_adapter() -> Adapter:
    adapter = requests_mock.Adapter()

    def test_matcher(request):
        if request.path == "/customerstatementmessages/":
            return MockResponse({'data': {'id': 1}}, 201)
        elif request.path == "/banktransactions/":
            return MockResponse({'data': {'id': 1}}, 201)

    adapter.add_matcher(test_matcher)
    return adapter


def do_csm_post(client, testfile):
    query = '''
        mutation testCSMCreate($file: Upload!) {
            createCustomerStatementMessage(file: $file) {
                ok
            }
        }
    '''

    return client.post(
        '/graphql/upload',
        data={
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
    )
