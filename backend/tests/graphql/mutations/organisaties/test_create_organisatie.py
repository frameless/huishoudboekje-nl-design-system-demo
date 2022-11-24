import requests_mock
from hhb_backend.graphql import settings

def test_create_organisatie_succes(client):
    with requests_mock.Mocker() as mock:
        # arrange
        input = {'kvknummer': '123456789', 'vestigingsnummer': '1', 'naam': 'testOrganisatie'}
        request = {
                "query": '''
                    mutation test($input:CreateOrganisatieInput!) {
                        createOrganisatie(input:$input) {
                            ok
                            organisatie {
                                id
                            }
                        }
                    }''',
                "variables": {"input": input}}
        fallback = mock.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        organisatie_1 = {'id': 1, 'kvknummer': 123, 'vestigingsnummer': 123}
        organisaties = mock.get(f"{settings.ORGANISATIE_SERVICES_URL}/organisaties/", json={'data': [organisatie_1]}, status_code=200)
        organisatie_new = {'id':2, 'kvknummer': '123456789', 'vestigingsnummer': '1', 'naam': 'testOrganisatie'}
        org = mock.post(f"{settings.ORGANISATIE_SERVICES_URL}/organisaties", json={'data': organisatie_new}, status_code=201)
        log = mock.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/")


        # act
        response = client.post("/graphql", json=request, content_type='application/json')

        # assert
        assert organisaties.call_count == 1
        assert org.call_count == 1
        assert log.call_count == 1
        assert fallback.call_count == 0
        assert response.json["data"]["createOrganisatie"]["ok"] is True

def test_create_organisatie_unique_fail(client):
    with requests_mock.Mocker() as mock:
        # arrange
        request = {
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
                    'naam': 'testOrganisatie'}}}
        fallback = mock.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        organisatie_1 = {'id': 1, 'kvknummer': 123, 'vestigingsnummer': 123}
        organisatie_2 = {'id': 2, 'kvknummer': 123, 'vestigingsnummer': 123}
        organisaties = mock.get(f"{settings.ORGANISATIE_SERVICES_URL}/organisaties/", json={'data': [organisatie_1, organisatie_2]}, status_code=200)


        # act
        response = client.post("/graphql", json=request, content_type='application/json')


        # assert
        assert organisaties.call_count == 1
        assert fallback.call_count == 0
        assert response.json["errors"][0]["message"] == "Combination kvk-nummer and vestigingsnummer is not unique."
