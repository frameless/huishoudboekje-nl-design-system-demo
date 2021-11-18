import requests_mock
from hhb_backend.graphql import settings

def test_delete_rubrieken(client):
    with requests_mock.Mocker() as rm:
        # arrange
        request = {"query":'''
                mutation test($id:Int!) {
                    deleteRubriek(id: $id) {
                        ok
                    }
                }''',
            "variables": {"id": 11}}
        expected = {'data': {'deleteRubriek': {'ok': True}}}
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.HHB_SERVICES_URL}/rubrieken/?filter_ids=11", status_code=200, json={"data":[{"id": 11}]})
        rm2 = rm.delete(f"{settings.HHB_SERVICES_URL}/rubrieken/11", status_code=204)
        rm3 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/")


        # act
        response = client.post("/graphql", json=request, content_type='application/json')


        # assert
        assert rm1.called_once
        assert rm2.called_once
        assert rm3.called_once
        assert fallback.call_count == 0
        assert response.json == expected