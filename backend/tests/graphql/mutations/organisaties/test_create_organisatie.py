import pytest
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
        if request.path == "/organisaties/":
            return MockResponse({'data': [{'id': 1, 'kvknummer': 123, 'vestiginsnummer': 123}]}, 201)

    adapter.add_matcher(test_matcher)
    return adapter


def test_create_organisatie_succes(client):
    with requests_mock.Mocker() as mock:
        mock._adapter = create_mock_adapter()

        response = client.post(
            "/graphql",
            json={
                "query": '''
        mutation test($input:CreateOrganisatieInput!) {
            createOrganisatie(input:$input) {
              ok
              organisatie {
                id
                }
            }
        }''',
                "variables": {"input": {
                    'kvknummer': '123456789',
                    'vestigingsnummer': '1',
                    'naam': 'testOrganisatie'}}},
            content_type='application/json'
        )

        assert mock._adapter.call_count == 3
        assert response.json["data"]["createOrganisatie"]["ok"] is True


def create_mock_adapter2() -> Adapter:
    adapter = requests_mock.Adapter()

    def test_matcher(request):
        if request.path == "/organisaties/":
            return MockResponse({'data': [{'id': 1, 'kvknummer': 123, 'vestigingsnummer': 123},
                                          {'id': 2, 'kvknummer': 123, 'vestigingsnummer': 123}]}, 201)
        elif request.path == "/gebruikersactiviteiten/":
            return MockResponse({'data': {'id': 1}}, 201)

    adapter.add_matcher(test_matcher)
    return adapter


def test_create_organisatie_unique_fail(client):
    with requests_mock.Mocker() as mock:
        mock._adapter = create_mock_adapter2()

        response = client.post(
            "/graphql",
            json={
                "query": '''
        mutation test($input:CreateOrganisatieInput!) {
            createOrganisatie(input:$input) {
              ok
              organisatie {
                id
                }
            }
        }''',
                "variables": {"input": {
                    'kvknummer': '123',
                    'vestigingsnummer': '123',
                    'naam': 'testOrganisatie'}}},
            content_type='application/json'
        )

        assert mock._adapter.call_count == 1
        assert response.json["errors"][0]["message"] == "Combination kvk-nummer and vestigingsnummer is not unique."
