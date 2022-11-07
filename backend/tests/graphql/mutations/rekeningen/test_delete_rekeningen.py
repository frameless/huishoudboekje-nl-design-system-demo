import requests_mock

from hhb_backend.graphql import settings


def test_delete_burger_rekening_succes(client):
    with requests_mock.Mocker() as rm:
        # arrange
        burger_id = 1
        rekening_id = 1
        request = {
            "query": '''
                mutation test($burgerId:Int!, $rekeningId:Int!) {
                    deleteBurgerRekening(burgerId: $burgerId, id: $rekeningId) {
                        ok
                    }
                }''',
            "variables": {"burgerId": burger_id, "rekeningId": rekening_id}
        }
        pre_delete_rekening = {
            "afdelingen": [],
            "afspraken": [],
            "burgers": [1],
            "iban": "NL21ABNA3184752488",
            "id": 1,
            "rekeninghouder": "piet pieter pieterson"
        }
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(
            f"{settings.HHB_SERVICES_URL}/rekeningen/?filter_ids=1",
            json={"data": [pre_delete_rekening]}
        )
        rm2 = rm.delete(f"{settings.HHB_SERVICES_URL}/burgers/1/rekeningen", status_code=202, json={})
        rm3 = rm.delete(f"{settings.HHB_SERVICES_URL}/rekeningen/1", status_code=204)
        rm4 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/")
        expected = {'data': {'deleteBurgerRekening': {'ok': True}}}

        # act
        response = client.post(
            "/graphql",
            json=request,
            content_type='application/json'
        )

        # assert
        assert rm1.call_count == 2
        assert rm2.call_count == 1
        assert rm3.call_count == 1
        assert rm4.call_count == 1
        assert fallback.call_count == 0
        assert response.json == expected


def test_delete_burger_rekening_multible_burgers(client):
    with requests_mock.Mocker() as rm:
        # arrange
        burger_id = 1
        rekening_id = 1
        request = {
            "query": '''
                mutation test($burgerId:Int!, $rekeningId:Int!) {
                    deleteBurgerRekening(burgerId: $burgerId, id: $rekeningId) {
                        ok
                    }
                }''',
            "variables": {"burgerId": burger_id, "rekeningId": rekening_id}
        }
        pre_delete_rekening = {
            "afdelingen": [],
            "afspraken": [],
            "burgers": [1, 2],
            "iban": "NL21ABNA3184752488",
            "id": 1,
            "rekeninghouder": "piet pieter pieterson"
        }
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.HHB_SERVICES_URL}/rekeningen/?filter_ids=1", json={"data": [pre_delete_rekening]})
        rm3 = rm.delete(f"{settings.HHB_SERVICES_URL}/burgers/1/rekeningen", status_code=202, json={})
        rm5 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/")
        expected = {'data': {'deleteBurgerRekening': {'ok': True}}}

        # act
        response = client.post(
            "/graphql",
            json=request,
            content_type='application/json'
        )

        # assert
        assert rm1.call_count == 2
        assert rm3.call_count == 1
        assert rm5.call_count == 1
        assert fallback.call_count == 0
        assert response.json == expected


def test_delete_afdeling_rekening_succes(client):
    with requests_mock.Mocker() as rm:
        # arrange
        afdeling_id = 1
        rekening_id = 1
        afdeling = {
            "data": [
                {
                    "id": afdeling_id,
                    "postadressen_ids": [],
                    "rekeningen_ids": [rekening_id]
                }
            ]
        }
        new_afdeling = {
            "data": {
                "id": afdeling_id,
                "postadressen_ids": [],
                "rekeningen_ids": []
            }
        }
        request = {
            "query": '''
                mutation test($afdelingId:Int!, $rekeningId:Int!) {
                    deleteAfdelingRekening(afdelingId: $afdelingId, rekeningId: $rekeningId) {
                        ok
                    }
                }''',
            "variables": {"afdelingId": afdeling_id, "rekeningId": rekening_id}
        }
        pre_delete_rekening = {
            "afdelingen": [1],
            "afspraken": [],
            "burgers": [],
            "iban": "NL21ABNA3184752488",
            "id": 1,
            "rekeninghouder": "piet pieter pieterson"
        }
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.HHB_SERVICES_URL}/rekeningen/?filter_ids=1", json={"data": [pre_delete_rekening]})
        rm2 = rm.delete(f"{settings.HHB_SERVICES_URL}/afdelingen/1/rekeningen", status_code=202, json={})
        rm3 = rm.delete(f"{settings.HHB_SERVICES_URL}/rekeningen/1", status_code=204)
        rm4 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/")
        rm5 = rm.get(f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/?filter_ids=1", json=afdeling)
        rm6 = rm.post(f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/1", json=new_afdeling)
        expected = {'data': {'deleteAfdelingRekening': {'ok': True}}}

        # act
        response = client.post(
            "/graphql",
            json=request,
            content_type='application/json'
        )

        # assert
        assert rm1.call_count == 2
        assert rm2.call_count == 1
        assert rm3.call_count == 1
        assert rm4.call_count == 1
        assert rm5.call_count == 1
        assert rm6.call_count == 1
        assert fallback.call_count == 0
        assert response.json == expected


def test_delete_burger_rekening_cant_delete_used_by_afspraak(client):
    with requests_mock.Mocker() as rm:
        # arrange
        burger_id = 1
        rekening_id = 1
        request = {
            "query": '''
                mutation test($burgerId:Int!, $rekeningId:Int!) {
                    deleteBurgerRekening(burgerId: $burgerId, id: $rekeningId) {
                        ok
                    }
                }''',
            "variables": {"burgerId": burger_id, "rekeningId": rekening_id}
        }
        pre_delete_rekening = {
            "afdelingen": [],
            "afspraken": [1],
            "burgers": [1],
            "iban": "NL21ABNA3184752488",
            "id": 1,
            "rekeninghouder": "piet pieter pieterson"
        }
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.HHB_SERVICES_URL}/rekeningen/?filter_ids=1", json={"data": [pre_delete_rekening]})
        expected = "Rekening is used in an afspraak - deletion is not possible."

        # act
        response = client.post(
            "/graphql",
            json=request,
            content_type='application/json'
        )

        # assert
        assert rm1.call_count == 2
        assert fallback.call_count == 0
        assert response.json["errors"][0].get("message") == expected


def test_delete_burger_rekening_cant_delete_also_used_by_afdeling(client):
    with requests_mock.Mocker() as rm:
        # arrange
        burger_id = 1
        rekening_id = 1
        request = {
            "query": '''
                mutation test($burgerId:Int!, $rekeningId:Int!) {
                    deleteBurgerRekening(burgerId: $burgerId, id: $rekeningId) {
                        ok
                    }
                }''',
            "variables": {"burgerId": burger_id, "rekeningId": rekening_id}
        }
        pre_delete_rekening = {
            "afdelingen": [1],
            "afspraken": [],
            "burgers": [1],
            "iban": "NL21ABNA3184752488",
            "id": 1,
            "rekeninghouder": "piet pieter pieterson"
        }
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.HHB_SERVICES_URL}/rekeningen/?filter_ids=1", json={"data": [pre_delete_rekening]})
        rm3 = rm.delete(f"{settings.HHB_SERVICES_URL}/burgers/1/rekeningen", status_code=202, json={})
        rm5 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/")
        expected = {'data': {'deleteBurgerRekening': {'ok': True}}}

        # act
        response = client.post(
            "/graphql",
            json=request,
            content_type='application/json'
        )

        # assert
        assert rm1.call_count == 2
        assert rm3.call_count == 1
        assert rm5.call_count == 1
        assert fallback.call_count == 0
        assert response.json == expected
