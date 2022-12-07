import requests_mock

from hhb_backend.graphql import settings


def test_create_afdeling_rekening(client):
    with requests_mock.Mocker() as rm:
        # arrange
        afdeling_id = 1
        afdeling = {
            "data" : [
                {
                    "id" : afdeling_id,
                    "postadressen_ids": [],
                    "rekeningen_ids": []
                }
            ]
        }
        new_afdeling = {
            "data" : {
                "id" : afdeling_id,
                "postadressen_ids": [],
                "rekeningen_ids": [1]
            }
        }
        new_rekening = {
            "iban": "NL19INGB7363245428",
            "rekeninghouder": "Piet Pieterson"
        }
        request = {
            "query": '''
                mutation test($afdelingId:Int!, $rekening:RekeningInput!) {
                    createAfdelingRekening(afdelingId: $afdelingId, rekening: $rekening) {
                        ok
                        rekening{
                            id
                        }
                    }
                }''',
            "variables": {"afdelingId": afdeling_id, "rekening": new_rekening}
        }
        rekening = {
            "data": [
                {
                    "afdelingen": [1],
                    "afspraken": [],
                    "burgers": [],
                    "iban": "NL21ABNA3184752488",
                    "id": 1,
                    "rekeninghouder": "piet pieter pieterson"
                }
            ]
        }
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.HHB_SERVICES_URL}/rekeningen/?filter_ibans=NL19INGB7363245428", json=rekening)

        rm2 = rm.post(
            f"{settings.HHB_SERVICES_URL}/afdelingen/1/rekeningen/", status_code=201,
            json={
                    "afdelingen": [1],
                    "afspraken": [],
                    "burgers": [],
                    "iban": "NL21ABNA3184752488",
                    "id": 1,
                    "rekeninghouder": "piet pieter pieterson"
                }
        )
        rm3 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/")
        rm4 = rm.get(f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/?filter_ids=1", json=afdeling)
        rm5 = rm.post(f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/1", json=new_afdeling)
        expected = {'data': {'createAfdelingRekening': {'ok': True, 'rekening': {'id': 1}}}}

        # act
        response = client.post(
            "/graphql",
            json=request,
            content_type='application/json'
        )

        # assert
        assert rm1.call_count == 1
        assert rm2.call_count == 1
        assert rm3.call_count == 1
        assert rm4.call_count == 1
        assert rm5.call_count == 1
        assert fallback.call_count == 0
        assert response.json == expected


def test_create_burger_rekening(client):
    with requests_mock.Mocker() as rm:
        # arrange
        burger_id = 1
        new_rekening = {
            "iban": "NL19INGB7363245428",
            "rekeninghouder": "Piet Pieterson"
        }
        request = {
            "query": '''
                mutation test($burgerId:Int!, $rekening:RekeningInput!) {
                    createBurgerRekening(burgerId: $burgerId, rekening: $rekening) {
                        ok
                        rekening{
                            id
                        }
                    }
                }''',
            "variables": {"burgerId": burger_id, "rekening": new_rekening}
        }
        rekening = {
            "data": [
                {
                    "afdelingen": [],
                    "afspraken": [],
                    "burgers": [1],
                    "iban": "NL21ABNA3184752488",
                    "id": 1,
                    "rekeninghouder": "piet pieter pieterson"
                }
            ]
        }
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.HHB_SERVICES_URL}/rekeningen/?filter_ibans=NL19INGB7363245428", json=rekening)

        rm2 = rm.post(
            f"{settings.HHB_SERVICES_URL}/burgers/1/rekeningen/", status_code=201,
            json={
                    "afdelingen": [],
                    "afspraken": [],
                    "burgers": [1],
                    "iban": "NL21ABNA3184752488",
                    "id": 1,
                    "rekeninghouder": "piet pieter pieterson"
                }
        )
        rm3 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/")
        expected = {'data': {'createBurgerRekening': {'ok': True, 'rekening': {'id': 1}}}}

        # act
        response = client.post(
            "/graphql",
            json=request,
            content_type='application/json'
        )

        # assert
        assert rm1.call_count == 1
        assert rm2.call_count == 1
        assert rm3.call_count == 1
        assert fallback.call_count == 0
        assert response.json == expected
