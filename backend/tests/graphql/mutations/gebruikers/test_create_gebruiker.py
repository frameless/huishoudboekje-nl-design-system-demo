import requests_mock
from requests_mock import Adapter

from hhb_backend.graphql import settings


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


def test_create_gebruiker_success(client):
    with requests_mock.Mocker() as mock:
        rekeningen_request = mock.get(f"{settings.HHB_SERVICES_URL}/rekeningen/?filter_ibans=gb33bukb20201555555555", json={'data': [{'id': 1}]}, status_code=200)
        gebruikers_request = mock.post(f"{settings.HHB_SERVICES_URL}/gebruikers/", json={'data': [{'id': 1}]}, status_code=201)
        gebruikers_rekeningen_request = mock.post(f"{settings.HHB_SERVICES_URL}/gebruikers/1/rekeningen/", json={'data': [{'id': 1}]}, status_code=201)
        log_request = mock.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", json={'data': [{'id': 1}]}, status_code=201)
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
        assert rekeningen_request.called_once
        assert gebruikers_request.called_once
        assert gebruikers_rekeningen_request.called_once
        assert log_request.called_once
        assert response.json["data"]["createGebruiker"]["ok"] is True
