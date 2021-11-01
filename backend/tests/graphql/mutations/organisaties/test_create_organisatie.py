import requests_mock
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


def test_create_organisatie_succes(client):
    with requests_mock.Mocker() as mock:

        fallback = mock.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        organisatie_new = {'kvknummer': '123456789', 'vestigingsnummer': '1', 'naam': 'testOrganisatie'}
        organisatie_1 = {'id': 1, 'kvknummer': 123, 'vestigingsnummer': 123}
        organisaties = mock.get(f"{settings.ORGANISATIE_SERVICES_URL}/organisaties/", json={'data': [organisatie_1]}, status_code=201)
        org = mock.post(f"{settings.ORGANISATIE_SERVICES_URL}/organisaties/", json={'data': [organisatie_new]}, status_code=201)

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
                "variables": {"input": organisatie_new}},
            content_type='application/json'
        )

        assert organisaties.called_once
        assert org.called_once
        assert fallback.call_count == 0
        assert response.json["data"]["createOrganisatie"]["ok"] is True

def test_create_organisatie_unique_fail(client):
    with requests_mock.Mocker() as mock:
        fallback = mock.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        organisatie_1 = {'id': 1, 'kvknummer': 123, 'vestigingsnummer': 123}
        organisatie_2 = {'id': 2, 'kvknummer': 123, 'vestigingsnummer': 123}
        organisaties = mock.get(f"{settings.ORGANISATIE_SERVICES_URL}/organisaties/", json={'data': [organisatie_1, organisatie_2]}, status_code=201)

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

        assert organisaties.called_once
        assert fallback.call_count == 0
        assert response.json["errors"][0]["message"] == "Combination kvk-nummer and vestigingsnummer is not unique."
