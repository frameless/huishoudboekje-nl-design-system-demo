import requests_mock
from hhb_backend.graphql import settings

def test_create_signaal_succes(client):
    with requests_mock.Mocker() as rm:
        alarm_id = "00943958-8b93-4617-aa43-669a9016aad9"
        input = {
            "alarmId": alarm_id,
            "isActive": True,
            "type": "default",
            "actions": [],
            "context": ""
        }
        signaal = {
            "id": "e2b282d9-b31f-451e-9242-11f86c902b35",
            "alarmId": alarm_id,
            "isActive": True,
            "type": "default",
            "actions": [],
            "context": "",
            "timeUpdated": "2021-12-13T13:20:40.784Z"
        }
        alarm = {
            "id": alarm_id,
        }
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm0 = rm.post(f"{settings.SIGNALENSERVICE_URL}/signals/", status_code=201, json={"ok": True, "data": signaal})
        rm1 = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/?filter_ids={alarm_id}", json={"data": [alarm]} )
        rm2 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201)
        expected = {'data': {'createSignaal': {'ok': True, 'signaal': {'id': 'e2b282d9-b31f-451e-9242-11f86c902b35', 'alarm': {'id': '00943958-8b93-4617-aa43-669a9016aad9'}, 'isActive': True, 'type': 'default', 'actions': [], 'context': '', 'timeUpdated': '2021-12-13T13:20:40.784Z'}}}}

        response = client.post(
            "/graphql",
            json={
                "query": '''
                    mutation test($input:CreateSignaalInput!) {
                        createSignaal(input:$input) {
                            ok
                            signaal{
                                id
                                alarm {
                                    id
                                }
                                isActive
                                type
                                actions
                                context
                                timeUpdated
                            }
                        }
                    }''',
                "variables": {
                    "input": input
                }
            },
            content_type="application/json"
        )

        print(f">>> response: {response.json}")

        assert rm0.call_count == 1
        assert rm1.call_count == 1
        assert rm2.call_count == 1
        assert fallback.called == 0
        assert response.json == expected
