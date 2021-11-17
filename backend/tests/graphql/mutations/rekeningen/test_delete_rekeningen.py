import requests_mock
from hhb_backend.graphql import settings

def test_delete_burger_rekening(client):
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
        post_delete_rekening = {
            "data":
            {
                "afdelingen": [],
                "afspraken": [],
                "burgers": [],
                "iban": "NL21ABNA3184752488",
                "id": 1,
                "rekeninghouder": "piet pieter pieterson"
            }   
        }
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.HHB_SERVICES_URL}/rekeningen/?filter_ids=1", status_code=200, json=pre_delete_rekening)
        rm2 = rm.delete(f"{settings.HHB_SERVICES_URL}/burgers/1/rekeningen/", status_code=202, json={})
        rm3 = rm.get(f"{settings.HHB_SERVICES_URL}/rekeningen/1", status_code=200, json=post_delete_rekening)
        rm4 = rm.delete(f"{settings.HHB_SERVICES_URL}/rekeningen/1", status_code=204)
        rm5 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/")
        expected = {
            "data": {
                "deleteBurgerRekening": {
                    "ok": True
                    }
                }
            }

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


def test_delete_afdeling_rekening(client):
    with requests_mock.Mocker() as rm:
        # arrange
        afdelingId = 1
        rekeningId = 1
        request = {"query":'''
                mutation test($afdelingId:Int!, $rekeningId:Int!) {
                    deleteAfdelingRekening(afdelingId: $afdelingId, rekeningId: $rekeningId) {
                        ok
                    }
                }''',
            "variables": {"afdelingId": afdelingId, "rekeningId": rekeningId}}
        pre_delete_rekening = {
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
        rm1 = rm.get(f"{settings.HHB_SERVICES_URL}/rekeningen/?filter_ids=1", status_code=200, json=pre_delete_rekening)
        rm2 = rm.delete(f"{settings.HHB_SERVICES_URL}/afdelingen/1/rekeningen", status_code=202, json={})
        rm4 = rm.delete(f"{settings.HHB_SERVICES_URL}/rekeningen/1", status_code=204)
        rm5 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/")
        expected = {
            "data": {
                "deleteAfdelingRekening": {
                    "ok": True
                    }
                }
            }

        # act
        response = client.post(
            "/graphql", 
            json=request,
            content_type='application/json'
        )

        # assert
        assert rm1.called_once
        assert rm2.called_once
        assert rm4.called_once
        assert rm5.called_once
        assert fallback.call_count == 0
        assert response.json == expected