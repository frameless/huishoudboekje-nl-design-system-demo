import requests_mock
from hhb_backend.graphql import settings

def test_postadres(client):
    with requests_mock.Mocker() as rm:
        rm.get(f"{settings.POSTADRESSEN_SERVICE_URL}/addresses/test_id",
               json={'id': "test_id",
                   'street': 'teststraat',
                   'houseNumber': '52B',
                   'postalCode': '9999ZZ',
                   'locality': 'testplaats'
                     })
        response = client.post(
            "/graphql",
            json={
                "query": '''
                query test ($id:String!) {
                    postadres(id:$id) {
                      huisnummer
                      plaatsnaam
                      postcode
                      straatnaam
                    }
                }''',
                "variables": {"id": "test_id"}},
            content_type='application/json'
        )
        assert response.json ==  {'data': {'postadres': {'huisnummer': '52B', 'plaatsnaam': 'testplaats', 'postcode': '9999ZZ', 'straatnaam': 'teststraat'}}}


def test_postadressen(client):
    with requests_mock.Mocker() as rm:
        rm.get(f"{settings.POSTADRESSEN_SERVICE_URL}/addresses/",
               json=[{'id': 'test_id',
                    'street': 'teststraat',
                    'houseNumber': '52B',
                    'postalCode': '9999ZZ',
                    'locality': 'testplaats'}])
        response = client.post(
            "/graphql",
            data='{"query": "{ postadressen { huisnummer straatnaam plaatsnaam postcode}}"}',
            content_type='application/json'
        )
        assert response.json ==  {'data': {'postadressen': [{'huisnummer': '52B', 'plaatsnaam': 'testplaats', 'postcode': '9999ZZ', 'straatnaam': 'teststraat'}]}}
