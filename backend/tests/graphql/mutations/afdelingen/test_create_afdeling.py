import requests_mock

from hhb_backend.graphql import settings


class MockResponse:
    history = None
    raw = None
    is_redirect = None
    content = None

    def __init__(self, json_data, status_code):
        self.json_data = json_data
        self.status_code = status_code

    def json(self):
        return self.json_data


def test_create_afdeling_minimal_succes(client):
    with requests_mock.Mocker() as mock:
        # arrange
        afdeling_result = {
            "data": {
                "id": 1,
                "postadressen_ids": [], 
                "rekeningen_ids": []
            }
        }
      
        fallback = mock.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        e1 = mock.get(f"{settings.ORGANISATIE_SERVICES_URL}/organisaties/?filter_ids=1", json={'data': [{'id': 1}]})
        e2 = mock.post(
            f"{settings.HHB_SERVICES_URL}/afdelingen/", status_code=201,
            json={'data': [{'id': 1, "postadressen_ids": [], "rekeningen_ids": []}]}
        )
        e3 = mock.post(f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/", status_code=201, json=afdeling_result)
        e9 = mock.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", json={'data': {'id': 1}})
        e10 = mock.get(f"{settings.HHB_SERVICES_URL}/rekeningen/?filter_afdelingen=1", json={"data": []})
        # act
        response = client.post(
            "/graphql",
            json={
                "query": '''
                    mutation test($input:CreateAfdelingInput!) {
                        createAfdeling(input:$input) {
                            ok
                            afdeling {
                                id
                                postadressen{
                                    id
                                }
                                 rekeningen{
                                    id
                                }
                            }
                        }
                    }''',
                "variables": {
                    "input": {
                        "organisatieId": 1,
                        "naam": "testAfdeling",
                    }
                }
            },
            content_type='application/json'
        )

        # assert
        assert e1.called_once
        assert e2.called_once
        assert e3.called_once
        assert e9.called_once
        assert e10.called_once
        assert response.json["data"]["createAfdeling"]["ok"] is True
        assert response.json["data"]["createAfdeling"]["afdeling"]["postadressen"] == []
        assert response.json["data"]["createAfdeling"]["afdeling"]["rekeningen"] == []

        assert fallback.call_count == 0


def test_create_afdeling_full_succes(client):
    with requests_mock.Mocker() as mock:
        # arrange
        rekeningen = {
            "id": 1,
            "iban": "GB33BUKB20201555555555",
            "rekeninghouder": "testrekeninghouder"
        }

        afdeling_result = {
            "data": {
                "id": 1,
                "naam": "testAfdeling",
                "postadressen_ids": [], 
                "rekeningen_ids": []
            }
        }

        rekening_result = {
            "data": [{
                "id": 1,
                "iban": "GB33BUKB20201555555555",
                "rekeninghouder": "testrekeninghouder",
                "afspraken": [],
                "burgers": [],
                "afdelingen": [1]
           }]
        }

        postadres_result = {
            "data": [{
                "@id": "/addresses/7426aa95-03c0-453d-b9ff-11a5442ab959",
                "@type": "Address",
                "id": "7426aa95-03c0-453d-b9ff-11a5442ab959",
                "name": None,
                "bagnummeraanduiding": None,
                "street": "teststraat",
                "houseNumber": "52B",
                "houseNumberSuffix": None,
                "postalCode": "9999ZZ",
                "region": None,
                "locality": "testplaats",
                "country": None,
                "postOfficeBoxNumber": None,
                "dateCreated": "2021-11-09T12:01:05+00:00",
                "dateModified": "2021-11-09T12:01:05+00:00"
            }]
        }

        fallback = mock.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        e1 = mock.get(f"{settings.ORGANISATIE_SERVICES_URL}/organisaties/?filter_ids=1", json={'data': [{'id': 1}]})
        e2 = mock.post(
            f"{settings.HHB_SERVICES_URL}/afdelingen/", status_code=201,
            json={'data': [{'id': 1, "postadressen_ids": [], "rekeningen_ids": []}]}
        )
        e3 = mock.post(f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/", status_code=201, json=afdeling_result)
        e4 = mock.get(
            f"{settings.HHB_SERVICES_URL}/rekeningen/?filter_ibans=GB33BUKB20201555555555",
            json={'data': [{'id': 1}]}
        )
        e5 = mock.post(
            f"{settings.HHB_SERVICES_URL}/afdelingen/1/rekeningen/", status_code=201,
            json={'data': rekeningen}
        )
        e6 = mock.post(
            f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/1",
            json={'data': [{'id': 1, "postadressen_ids": [], "rekeningen_ids": []}]}
        )
        e7 = mock.post(
            f"{settings.POSTADRESSEN_SERVICE_URL}/addresses", status_code=201,
            json={'data': {
                'id': "7426aa95-03c0-453d-b9ff-11a5442ab959", 'houseNumber': '52B', 'postalCode': '9999ZZ',
                'street': 'teststraat', 'locality': 'testplaats'
            }})
        e8 = mock.get(
            f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/?filter_ids=1",
            json={'data': [{'id': 1, 'postadressen_ids': [], 'rekeningen_ids': []}]}
        )
        e9 = mock.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/")
        e10 = mock.get(f"{settings.HHB_SERVICES_URL}/rekeningen/?filter_afdelingen=1", json=rekening_result)
        e11 = mock.get(
            f"{settings.POSTADRESSEN_SERVICE_URL}/addresses/?filter_ids=7426aa95-03c0-453d-b9ff-11a5442ab959",
            json=postadres_result
        )

        # act
        response = client.post(
            "/graphql",
            json={
                "query": '''
                    mutation test($input:CreateAfdelingInput!) {
                        createAfdeling(input:$input) {
                            ok
                            afdeling {
                                id
                                postadressen{
                                    id
                                }
                                rekeningen{
                                    id
                                }
                            }
                        }
                    }''',
                "variables": {
                    "input": {
                        "organisatieId": 1,
                        "naam": "testAfdeling",
                        "postadressen": [{
                            "straatnaam": "testStraat",
                            "huisnummer": "52B",
                            "postcode": "9999ZZ",
                            "plaatsnaam": "testplaats"
                        }],
                        "rekeningen": [{
                            "iban": "GB33BUKB20201555555555",
                            "rekeninghouder": "testrekeninghouder"
                        }]
                    }
                }
            },
            content_type='application/json'
        )

        # assert
        assert e1.called_once
        assert e2.called_once
        assert e3.called_once
        assert e4.called_once
        assert e5.called_once
        assert e6.call_count == 3
        assert e7.called_once
        assert e8.call_count == 2
        assert e9.called_once
        assert e10.called_once
        assert e11.called_once
        assert fallback.call_count == 0
        assert response.json["data"]["createAfdeling"]["ok"] is True
        assert response.json["data"]["createAfdeling"]["afdeling"]["postadressen"] == [{'id': '7426aa95-03c0-453d-b9ff-11a5442ab959'}]
        assert response.json["data"]["createAfdeling"]["afdeling"]["rekeningen"] == [{'id': 1}]
        

def test_create_afdeling_foutieve_rekening_succes(client):
    with requests_mock.Mocker() as mock:
        # arrange
        afdeling_result = {
            "data": {
                "id": 1,
                "naam": "testAfdeling",
                "postadressen_ids": [], 
                "rekeningen_ids": []
            }
        }

        fallback = mock.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        e1 = mock.get(f"{settings.ORGANISATIE_SERVICES_URL}/organisaties/?filter_ids=1", json={'data': [{'id': 1}]})
        e2 = mock.post(
            f"{settings.HHB_SERVICES_URL}/afdelingen/", status_code=201,
            json={'data': [{'id': 1, "postadressen_ids": [], "rekeningen_ids": []}]}
        )
        e3 = mock.post(f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/", status_code=201, json=afdeling_result)
        e4 = mock.get(f"{settings.HHB_SERVICES_URL}/rekeningen/?filter_ibans=33bukb20201555555555", json={'data': []})

        # act
        response = client.post(
            "/graphql",
            json={
                "query": '''
                    mutation test($input:CreateAfdelingInput!) {
                        createAfdeling(input:$input) {
                            ok
                            afdeling {
                                id
                            }
                        }
                    }''',
                "variables": {
                    "input": {
                        "organisatieId": 1,
                        "naam": "testAfdeling",
                        "rekeningen": [{
                            "iban": "33bukb20201555555555",
                            "rekeninghouder": "testrekeninghouder"
                        }]
                    }
                }
            },
            content_type='application/json'
        )

        # assert
        assert fallback.call_count == 0
        assert e1.called_once
        assert e2.called_once
        assert e3.called_once
        # rekeningen
        assert e4.called_once
        assert response.json['errors'][0]['message'] == "Wrong IBAN: 33bukb20201555555555"

