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
        if request.path == "/rekeningen/" and request.query == "filter_ibans=gb33bukb20201555555555":
            return MockResponse({'data': [{'id': 1}]}, 200)
        elif request.path == "/gebruikers/":
            return MockResponse({'data': {'id': 1}}, 201)
        elif request.path == "/gebruikers/1/rekeningen/":
            return MockResponse({'data': "{'id': 1}"}, 201)

    adapter.add_matcher(test_matcher)
    return adapter


def test_create_gebruiker_success(client):
    with requests_mock.Mocker() as mock:
        mock._adapter = create_mock_adapter()
        response = client.post(
            "/graphql",
            json={
                "query": '''
        mutation test($input:CreateGebruikerInput!) {
          createGebruiker(input:$input) {
            ok
            gebruiker {
              id
            }
          }
        }''',
                "variables": {"input": {
                    'email': 'test@test.com',
                    'geboortedatum': "1999-10-10",
                    'telefoonnummer': "0612345678",
                    'achternaam': "Hulk",
                    'huisnummer': "13a",
                    'postcode': "9999ZZ",
                    'straatnaam': "Hoofdstraat",
                    'voorletters': "H",
                    'voornamen': "Hogan",
                    'plaatsnaam': "Dorp",
                    'rekeningen': [{"iban": "GB33BUKB20201555555555",
                                    "rekeninghouder": "C. Lown"}]}}},
            content_type='application/json'
        )
        assert mock._adapter.call_count == 3
        assert response.json["data"]["createGebruiker"]["ok"] is True
