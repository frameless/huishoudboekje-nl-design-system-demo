import requests_mock

from hhb_backend.graphql import settings

def test_export_getAll(client):
    with requests_mock.Mocker() as rm:
        # arrange
        request = '{"query": "{ exports { id } }"}'
        exportData = {
            'data': [{
                'id': 1,
            }]
        }
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.HHB_SERVICES_URL}/export/", status_code=200, json=exportData)
        rm2 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201)

        # act
        response = client.post("/graphql", data=request, content_type='application/json')

        # assert
        assert rm1.called_once
        assert rm2.called_once
        assert fallback.call_count == 0
        assert response.json == {'data': {
            'exports': [{
                'id': 1,
            }]
        }}


def test_export_getById(client):
    with requests_mock.Mocker() as rm:
        # arrange
        request = '{"query": "{ export(id:1) { id } }"}'
        exportData = {
            'data': [{
                'id': 1,
            }]
        }
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.HHB_SERVICES_URL}/export/?filter_ids=1", status_code=200, json=exportData)
        rm2 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201)

        # act
        response = client.post("/graphql", data=request, content_type='application/json')

        # assert
        assert rm1.called_once
        assert rm2.called_once
        assert fallback.call_count == 0
        assert response.json == {'data': {'export': {'id': 1}}} 
