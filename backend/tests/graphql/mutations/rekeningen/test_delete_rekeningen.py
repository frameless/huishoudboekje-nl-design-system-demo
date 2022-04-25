import requests_mock
from hhb_backend.graphql import settings

def test_delete_burger_rekening_succes(client):
    with requests_mock.Mocker() as rm:
        # arrange
        burgerId = 1
        rekeningId = 1
        request = {"query":'''
                mutation test($burgerId:Int!, $rekeningId:Int!) {
                    deleteBurgerRekening(burgerId: $burgerId, id: $rekeningId) {
                        ok
                    }
                }''',
            "variables": {"burgerId": burgerId, "rekeningId": rekeningId}}
        pre_delete_rekening = {
            "afdelingen": [],
            "afspraken": [],
            "burgers": [1],
            "iban": "NL21ABNA3184752488",
            "id": 1,
            "rekeninghouder": "piet pieter pieterson"
        }
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.HHB_SERVICES_URL}/rekeningen/?filter_ids=1", status_code=200, json={ "data": [pre_delete_rekening]})
        rm2 = rm.get(f"{settings.HHB_SERVICES_URL}/rekeningen/1", status_code= 200, json= {"data":pre_delete_rekening})
        rm3 = rm.delete(f"{settings.HHB_SERVICES_URL}/burgers/1/rekeningen", status_code=202, json={})
        rm4 = rm.delete(f"{settings.HHB_SERVICES_URL}/rekeningen/1", status_code=204)
        rm5 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/")
        expected = {'data': {'deleteBurgerRekening': {'ok': True}}}

        # act
        response = client.post(
            "/graphql", 
            json=request,
            content_type='application/json'
        )

        # assert
        assert rm1.called_once
        assert rm2.called_once
        assert rm3.called_once
        assert rm4.called_once
        assert rm5.called_once
        assert fallback.call_count == 0
        assert response.json == expected

def test_delete_burger_rekening_multible_burgers(client):
    with requests_mock.Mocker() as rm:
        # arrange
        burgerId = 1
        rekeningId = 1
        request = {"query":'''
                mutation test($burgerId:Int!, $rekeningId:Int!) {
                    deleteBurgerRekening(burgerId: $burgerId, id: $rekeningId) {
                        ok
                    }
                }''',
            "variables": {"burgerId": burgerId, "rekeningId": rekeningId}}
        pre_delete_rekening = {
            "afdelingen": [],
            "afspraken": [],
            "burgers": [1, 2],
            "iban": "NL21ABNA3184752488",
            "id": 1,
            "rekeninghouder": "piet pieter pieterson"
        }
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.HHB_SERVICES_URL}/rekeningen/?filter_ids=1", status_code=200, json={ "data": [pre_delete_rekening]})
        rm2 = rm.get(f"{settings.HHB_SERVICES_URL}/rekeningen/1", status_code= 200, json= {"data":pre_delete_rekening})
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
        assert rm1.called_once
        assert rm2.called_once
        assert rm3.called_once
        assert rm5.called_once
        assert fallback.call_count == 0
        assert response.json == expected

def test_delete_afdeling_rekening_succes(client):
    with requests_mock.Mocker() as rm:
        # arrange
        afdelingId = 1
        rekeningId = 1
        afdeling = {
            "data" : {
                "id" : afdelingId,
                "postadressen_ids": [], 
                "rekeningen_ids": [rekeningId]
            }
        }
        new_afdeling = {
            "data" : {
                "id" : afdelingId,
                "postadressen_ids": [], 
                "rekeningen_ids": []
            }
        }
        request = {"query":'''
                mutation test($afdelingId:Int!, $rekeningId:Int!) {
                    deleteAfdelingRekening(afdelingId: $afdelingId, rekeningId: $rekeningId) {
                        ok
                    }
                }''',
            "variables": {"afdelingId": afdelingId, "rekeningId": rekeningId}}
        pre_delete_rekening = {
            "afdelingen": [1],
            "afspraken": [],
            "burgers": [],
            "iban": "NL21ABNA3184752488",
            "id": 1,
            "rekeninghouder": "piet pieter pieterson"
        }
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.HHB_SERVICES_URL}/rekeningen/?filter_ids=1", status_code=200, json={ "data": [pre_delete_rekening]})
        rm2 = rm.get(f"{settings.HHB_SERVICES_URL}/rekeningen/1", status_code= 200, json= {"data":pre_delete_rekening})
        rm3 = rm.delete(f"{settings.HHB_SERVICES_URL}/afdelingen/1/rekeningen", status_code=202, json={})
        rm4 = rm.delete(f"{settings.HHB_SERVICES_URL}/rekeningen/1", status_code=204)
        rm5 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/")
        rm6 = rm.get(f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/1", status_code=200, json=afdeling)
        rm7 = rm.post(f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/1", status_code=200, json=new_afdeling)
        expected = {'data': {'deleteAfdelingRekening': {'ok': True}}}

        # act
        response = client.post(
            "/graphql", 
            json=request,
            content_type='application/json'
        )

        # assert
        assert rm1.called_once
        assert rm2.called_once
        assert rm3.called_once
        assert rm4.called_once
        assert rm5.called_once
        assert rm6.called_once
        assert rm7.called_once
        assert fallback.call_count == 0
        assert response.json == expected

def test_delete_burger_rekening_cant_delete_used_by_afspraak(client):
    with requests_mock.Mocker() as rm:
        # arrange
        burgerId = 1
        rekeningId = 1
        request = {"query":'''
                mutation test($burgerId:Int!, $rekeningId:Int!) {
                    deleteBurgerRekening(burgerId: $burgerId, id: $rekeningId) {
                        ok
                    }
                }''',
            "variables": {"burgerId": burgerId, "rekeningId": rekeningId}}
        pre_delete_rekening = {
            "afdelingen": [],
            "afspraken": [1],
            "burgers": [1],
            "iban": "NL21ABNA3184752488",
            "id": 1,
            "rekeninghouder": "piet pieter pieterson"
        }
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.HHB_SERVICES_URL}/rekeningen/?filter_ids=1", status_code=200, json={"data": [pre_delete_rekening]})
        rm2 = rm.get(f"{settings.HHB_SERVICES_URL}/rekeningen/1", status_code=200, json={"data":pre_delete_rekening})
        expected = "Rekening wordt gebruikt in een afspraak - verwijderen is niet mogelijk."

        # act
        response = client.post(
            "/graphql", 
            json=request,
            content_type='application/json'
        )

        # assert
        assert rm1.called_once
        assert rm2.call_count == 1
        assert fallback.call_count == 0
        assert response.json["errors"][0].get("message") == expected

def test_delete_burger_rekening_cant_delete_also_used_by_afdeling(client):
    with requests_mock.Mocker() as rm:
        # arrange
        burgerId = 1
        rekeningId = 1
        request = {"query":'''
                mutation test($burgerId:Int!, $rekeningId:Int!) {
                    deleteBurgerRekening(burgerId: $burgerId, id: $rekeningId) {
                        ok
                    }
                }''',
            "variables": {"burgerId": burgerId, "rekeningId": rekeningId}}
        pre_delete_rekening = {
            "afdelingen": [1],
            "afspraken": [],
            "burgers": [1],
            "iban": "NL21ABNA3184752488",
            "id": 1,
            "rekeninghouder": "piet pieter pieterson"
        }
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.HHB_SERVICES_URL}/rekeningen/?filter_ids=1", status_code=200, json={ "data": [pre_delete_rekening]})
        rm2 = rm.get(f"{settings.HHB_SERVICES_URL}/rekeningen/1", status_code= 200, json= {"data":pre_delete_rekening})
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
        assert rm1.called_once
        assert rm2.called_once
        assert rm3.called_once
        assert rm5.called_once
        assert fallback.call_count == 0
        assert response.json == expected
