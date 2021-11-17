import requests_mock
from hhb_backend.graphql import settings

rubriek = {
    "id": 11, 
    "naam": "test rubriek",
    "grootboekrekening_id": "m12"
}

grootboek = {
    "id": "m12", 
    "naam": "inkomsten",
    "children": [],
}

def test_rubrieken_minimal(client):
    with requests_mock.Mocker() as rm:
        # arrange
        request= {
                "query": '''
                query test {
                    rubrieken{
                        id
                    }
                }'''}
        expected = {'data': {'rubrieken': [{'id': 11}]}}
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.HHB_SERVICES_URL}/rubrieken/", status_code=200, json={"data": [rubriek]})
        rm2 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=200)


        # act
        response = client.post("/graphql", json=request, content_type='application/json')


        # assert
        assert rm1.called_once
        assert rm2.called_once
        assert fallback.call_count == 0
        assert response.json == expected

def test_rubrieken(client):
    with requests_mock.Mocker() as rm:
        # arrange
        request= {
                "query": '''
                query test {
                    rubrieken{
                        id
                        naam
                        grootboekrekening{
                           id
                        }
                    }
                }'''}
        expected = {'data': {'rubrieken': [{'id': 11, 'naam': 'test rubriek', 'grootboekrekening': {'id': 'm12'}}]}}
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.HHB_SERVICES_URL}/rubrieken/", status_code=200, json={"data": [rubriek]})
        rm2 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=200)
        rm3 = rm.get(f"{settings.GROOTBOEK_SERVICE_URL}/grootboekrekeningen/?filter_ids=m12", status_code=200, json={"data":[grootboek]})


        # act
        response = client.post("/graphql", json=request, content_type='application/json')


        # assert
        assert rm1.called_once
        assert rm2.called_once
        assert rm3.called_once
        assert fallback.call_count == 0
        assert response.json == expected
