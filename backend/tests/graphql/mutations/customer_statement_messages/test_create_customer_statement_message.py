import json
import os

ING_CSM_FILE = os.path.join(os.path.dirname(__file__), 'ING.txt')


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
    with open(ING_CSM_FILE, "rb") as testfile:
        query = '''
            mutation testCSMCreate($file: Upload!) {
                createCustomerStatementMessage(file: $file) {
                    ok
                }
            }
        '''
        response = client.post(
            '/graphql_upload',
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
        assert response.status_code == 200
