import requests_mock
from hhb_backend.graphql import settings

def test_gebruikersactiviteiten(client):
    with requests_mock.Mocker() as mock:
        # arrange
        request = {
            "query": '''
                query test  {
                    gebruikersactiviteiten{
                        id
                    }
                }'''}
        expected = {
            "data": {
                "gebruikersactiviteiten": [
                {
                    "id": 1
                }]
        }}
        action1 = {
            "action": "organisaties",
            "entities": [],
            "gebruiker_id": None,
            "id": 1,
            "meta": {
                "applicationVersion": "0.3.0",
                "ip": "172.30.0.1",
                "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36"
            },
            "snapshot_after": None,
            "snapshot_before": None,
            "timestamp": "2021-11-09T12:00:12+00:00"
        }
        data = { "data": [action1]}
        fallback = mock.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        get_data = mock.get(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=200, json=data)
        log_get = mock.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201)

        # act
        response = client.post("/graphql", json=request, content_type='application/json')

        # assert
        assert get_data.call_count == 1
        assert log_get.call_count == 1
        assert fallback.call_count == 0
        assert response.json ==  expected


def test_gebruikersactiviteiten_byId(client):
    with requests_mock.Mocker() as mock:
        # arrange
        request = {
            "query": '''
                query test($id:Int!) {
                    gebruikersactiviteit(id: $id){
                        id
                    }
                }''',
                "variables": {"id": 1}
            }
        expected = {'data': {'gebruikersactiviteit': {'id': 1}}}
        action1 = {
            "action": "organisaties",
            "entities": [],
            "gebruiker_id": None,
            "id": 1,
            "meta": {
                "applicationVersion": "0.3.0",
                "ip": "172.30.0.1",
                "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36"
            },
            "snapshot_after": None,
            "snapshot_before": None,
            "timestamp": "2021-11-09T12:00:12+00:00"
        }
        data = { "data": [action1]}
        fallback = mock.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        mock1 = mock.get(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/?filter_ids=1", status_code=200, json=data)

        # act
        response = client.post("/graphql", json=request, content_type='application/json')

        # assert
        assert mock1.call_count == 1
        assert fallback.call_count == 0
        assert response.json ==  expected
