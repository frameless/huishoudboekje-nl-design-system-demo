import requests_mock
from hhb_backend.graphql import settings

def test_update_signaal(client):
    with requests_mock.Mocker() as rm:
        signaal_id = "e2b282d9-b31f-451e-9242-11f86c902b35"
        alarm_id1 = "00943958-8b93-4617-aa43-669a9016aad9"
        alarm_id2 = "bd6222e7-bfab-46bc-b0bc-2b30b76228d4"
        signaal = {
            "id": signaal_id,
            "alarmId": alarm_id1,
            "isActive": True,
            "type": "default",
            "actions": [],
            "context": "",
            "timeUpdated": "2021-12-13T13:20:40.784Z"
        }
        input = {
            "alarmId": alarm_id2,
            "isActive": False,
        }
        updated_signaal = {
            "id": signaal_id,
            "alarmId": alarm_id2,
            "isActive": False,
            "type": "default",
            "actions": [],
            "context": "",
            "timeUpdated": "2021-12-13T13:20:40.784Z"
        }
        expected = {'data': {'updateSignaal': {
            'ok': True,
            'previous': {
                "id": "e2b282d9-b31f-451e-9242-11f86c902b35",
                "alarm": {"id": alarm_id1},
                "isActive": True,
                "type": "default",
                "actions": [],
                "context": "",
                "timeUpdated": "2021-12-13T13:20:40.784Z"
            },
            'signaal':{
                "id": "e2b282d9-b31f-451e-9242-11f86c902b35",
                "alarm": {"id": alarm_id2},
                "isActive": False,
                "type": "default",
                "actions": [],
                "context": "",
                "timeUpdated": "2021-12-13T13:20:40.784Z"
            }
        }}}

        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm0 = rm.get(f"{settings.SIGNALENSERVICE_URL}/signals/?filter_ids={signaal_id}", status_code=200, json={'data': [signaal]})
        rm1 = rm.put(f"{settings.SIGNALENSERVICE_URL}/signals/{signaal_id}", status_code=200, json={"ok": True, "data": updated_signaal})
        rm2 = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/?filter_ids={alarm_id1}", json={"data": [{"id": alarm_id1}]})
        rm3 = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/?filter_ids={alarm_id2}", json={"data": [{"id": alarm_id2}]})
        rm4 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201)

        response = client.post(
            "/graphql",
            json={
                "query": '''
                    mutation test($id: String!, $input: UpdateSignaalInput!) {
                        updateSignaal(id: $id, input: $input) {
                            ok
                            previous {
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
                            signaal {
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
                    }
                    ''',
                "variables": {"id": signaal_id, "input": input}
            },
            content_type='application/json'
        )

        assert rm0.call_count == 1
        assert rm1.call_count == 1
        assert rm2.call_count == 1
        assert rm3.call_count == 1
        assert rm4.call_count == 1
        assert fallback.called == 0
        assert response.json == expected
