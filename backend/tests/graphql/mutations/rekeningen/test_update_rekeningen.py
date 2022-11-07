import requests_mock
from hhb_backend.graphql import settings

def test_update_afdeling_rekening(client):
    with requests_mock.Mocker() as rm:
        # arrange
        rekeningId = 1
        updateRekening = {
            "iban": "NL21ABNA3184752488",
            "rekeninghouder" :"piet pieter pieterson"
        }
        request = {"query":'''
                mutation test($rekeningId:Int!, $rekening:RekeningInput!) {
                    updateRekening(id: $rekeningId, rekening: $rekening) {
                        ok
                         rekening{
                            id
                            iban
                            rekeninghouder
                            burgers{ id }
                            afdelingen{ id }
                            afspraken{ id }
                        }
                    }
                }''',
            "variables":
            	{
                    "rekeningId": rekeningId,
                    "rekening": updateRekening
                }
            }

        existingRekening={
            "data": [
                {
                    "afdelingen": [],
                    "afspraken": [],
                    "burgers": [],
                    "iban": "NL21ABNA3184752488",
                    "id": 1,
                    "rekeninghouder": "pieter"
                }
            ]
        }

        updatedRekening={
            "data": {
                "iban": "NL21ABNA3184752488",
                "id": 1,
                "rekeninghouder": "piet"
            }
        }

        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.HHB_SERVICES_URL}/rekeningen/?filter_ids=1", status_code=200, json=existingRekening)
        rm2 = rm.post(f"{settings.HHB_SERVICES_URL}/rekeningen/1", status_code=200, json=updatedRekening)
        rm3 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=200)

        expected = {
            "data": {
                "updateRekening": {
                    "ok": True,
                    "rekening": {
                        "id": 1,
                        "iban": "NL21ABNA3184752488",
                        "rekeninghouder": "piet",
                        "burgers": None,
                        "afdelingen": None,
                        "afspraken": None
                    }
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
        assert rm1.call_count == 1
        assert rm2.call_count == 1
        assert rm3.call_count == 1
        assert fallback.call_count == 0
        assert response.json == expected
