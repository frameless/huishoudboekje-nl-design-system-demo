import requests_mock
from hhb_backend.graphql import settings

def test_delete_signaal(client):
    with requests_mock.Mocker() as rm:
        signaal_id = "e2b282d9-b31f-451e-9242-11f86c902b35"
        alarm_id = "00943958-8b93-4617-aa43-669a9016aad9"
        signaal = {
            "id": "e2b282d9-b31f-451e-9242-11f86c902b35",
            "alarmId": alarm_id,
            "isActive": True,
            "type": "default",
            "actions": [],
            "context": "",
            "timeUpdated": "2021-12-13T13:20:40.784Z"
        }
        expected = {'data': {'deleteSignaal': {'ok': True}}}

        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm0 = rm.get(f"{settings.SIGNALENSERVICE_URL}/signals/?filter_ids={signaal_id}", status_code=200, json={'data': [signaal]})
        rm1 = rm.delete(f"{settings.SIGNALENSERVICE_URL}/signals/{signaal_id}", status_code=204, json={})
        rm2 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201)

        response = client.post(
            "/graphql",
            json={
                "query": '''
                    mutation test($id: String!) {
                        deleteSignaal(id: $id) {
                            ok
                        }
                    }
                    ''',
                "variables": {"id": signaal_id}
            },
            content_type='application/json'
        )

        assert rm0.call_count == 1
        assert rm1.call_count == 1
        assert rm2.call_count == 1
        assert fallback.called == 0
        assert response.json == expected

def test_delete_signaal_failure(client):
    with requests_mock.Mocker() as rm:
        signaal_id = "e2b282d9-b31f-451e-9242-11f86c902b35"
        expected = f"Signaal with id {signaal_id} not found"

        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm0 = rm.get(f"{settings.SIGNALENSERVICE_URL}/signals/?filter_ids={signaal_id}", status_code=200, json={'data': []})

        response = client.post(
            "/graphql",
            json={
                "query": '''
                    mutation test($id: String!) {
                        deleteSignaal(id: $id) {
                            ok
                        }
                    }
                    ''',
                "variables": {"id": signaal_id}
            },
            content_type='application/json'
        )

        assert rm0.call_count == 1
        assert fallback.called == 0
        assert response.json["errors"][0]["message"] == expected
