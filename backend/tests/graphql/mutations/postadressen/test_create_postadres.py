import pytest
import requests_mock
from hhb_backend.graphql import settings

def test_create_postadres_succes(client):
    with requests_mock.Mocker() as rm:
        # arrange
        postadres_new = {
            "id": "38760fc9-2fa4-46fd-8bfe-9d8967011a5e",
            "street": "teststraat",
            "houseNumber": "52B",
            "postalCode": "9999ZZ",
            "locality": "testplaats",
        }
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/?filter_ids=1", status_code=200, json={'data': [{'id': 1, 'postadressen_ids': []}]})
        rm2 = rm.post(f"{settings.POSTADRESSEN_SERVICE_URL}/addresses", status_code=201, json={"address" : postadres_new})
        rm3 = rm.post(f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/1", status_code=200, json={'data': {'id': 1, 'postadressen_ids': ["38760fc9-2fa4-46fd-8bfe-9d8967011a5e"]}})
        rm4 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=200)

        # act
        response = client.post(
            "/graphql",
            json={
                "query": '''
                    mutation test($input:CreatePostadresInput!) {
                        createPostadres(input:$input) {
                        ok
                        postadres {
                            id
                        }
                    }
                }''',
                "variables": {"input": {
                    'straatnaam': 'teststraat',
                    'huisnummer': '52B',
                    'postcode': '9999ZZ',
                    'plaatsnaam': 'testplaats',
                    'afdelingId': 1}}},
            content_type='application/json'
        )


        # assert
        assert rm1.called_once
        assert rm2.called_once
        assert rm3.called_once
        assert rm4.called_once
        assert fallback.call_count == 0
        assert response.json["data"]["createPostadres"]["ok"] is True

