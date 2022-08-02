import requests_mock
from hhb_backend.graphql import settings
from freezegun import freeze_time

@freeze_time("2021-12-01")
def test_update_alarm(client):
    with requests_mock.Mocker() as rm:
        # arrange
        input = {
            "isActive": False,
            "afspraakId": 20,
            "startDate":"2021-12-02",
            "datumMargin": 1,
            "bedrag": "12.34",
            "bedragMargin":"56.78",
            "byDay": ["Thursday"]
        }
        alarm_id = "bd6222e7-bfab-46bc-b0bc-2b30b76228d4"
        alarm1 = {
            "id": alarm_id,
            "afspraakId": 19,
            "isActive": True,
            "startDate": "2021-12-07",
            "datumMargin": 5,
            "bedrag": "180012",
            "bedragMargin": "1000",
            "byDay": ["Wednesday"]
        }
        afspraak = {
            "id": 20
        }
        updated_alarm = {
            "id": alarm_id,
            "afspraakId": 20,
            "isActive": False,
            "startDate":"2021-12-02",
            "datumMargin": 1,
            "bedrag": "1234",
            "bedragMargin":"5678",
            "byDay": ["Thursday"]
        }
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm0 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids=19", status_code=200, json={"data": [{"id": 19}]})
        rm1 = rm.put(f"{settings.ALARMENSERVICE_URL}/alarms/{alarm_id}", status_code=200, json={ "ok":True, "data": updated_alarm})
        rm2 = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/?filter_ids={alarm_id}", status_code=200, json={"data": [alarm1]})
        rm3 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201)
        rm4 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids=20", status_code=200, json={"data": [afspraak]})
        expected = {'data': {'updateAlarm': {'ok': True, 'previous': {'id': 'bd6222e7-bfab-46bc-b0bc-2b30b76228d4', 'isActive': True, 'afspraak': {"id": 19}, 'startDate': '2021-12-07', 'datumMargin': 5, 'bedrag': '1800.12', 'bedragMargin': '10.00', 'byDay': ['Wednesday'], 'byMonth': [], 'byMonthDay': []}, 'alarm': {'id': 'bd6222e7-bfab-46bc-b0bc-2b30b76228d4', 'isActive': False, 'afspraak': {'id': 20}, 'startDate': '2021-12-02', 'datumMargin': 1, 'bedrag': '12.34', 'bedragMargin': '56.78', 'byDay': ['Thursday'], 'byMonth': [], 'byMonthDay': []}}}}

        # act
        response = client.post(
            "/graphql",
            json={
                "query": '''
                    mutation test($id:String!, $input:UpdateAlarmInput!) {
                        updateAlarm(id:$id, input:$input) {
                            ok
                            previous{
                                id
                                isActive
                                afspraak{
                                    id
                                }
                                startDate
                                datumMargin
                                bedrag
                                bedragMargin
                                byDay
                                byMonth
                                byMonthDay
                            }
                            alarm {
                                id
                                isActive
                                afspraak{
                                    id
                                }
                                startDate
                                datumMargin
                                bedrag
                                bedragMargin
                                byDay
                                byMonth
                                byMonthDay
                            }
                        }
                    }''',
                "variables": {
                    "id": alarm_id,
                    "input": input
                }
            },
            content_type='application/json'
        )

        # assert
        assert rm0.called_once
        assert rm1.called_once
        assert rm2.called_once
        assert rm3.called_once
        assert rm4.called_once
        assert fallback.called == 0
        assert response.json == expected

# This test can be turned on again when the date in past check is turned on in the update alarm function.
# @freeze_time("2021-12-01")
# def test_update_alarm_failure_cant_set_alarm_in_past(client):
#     with requests_mock.Mocker() as rm:
#         # arrange
#         input = {
#             "isActive": False,
#             "afspraakId": 20,
#             "startDate":"2021-01-01",
#             "datumMargin": 1,
#             "bedrag": "12.34",
#             "bedragMargin":"56.78",
#             "byDay": ["Thursday"]
#         }
#         alarm_id = "bd6222e7-bfab-46bc-b0bc-2b30b76228d4"
#         expected = "Alarm start datum is in het verleden." 

#         fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)

#         # act
#         response = client.post(
#             "/graphql",
#             json={
#                 "query": '''
#                     mutation test($id:String!, $input:UpdateAlarmInput!) {
#                         updateAlarm(id:$id, input:$input) {
#                             ok
#                             previous{
#                                 id
#                                 isActive
#                                 afspraak{
#                                     id
#                                 }
#                                 startDate
#                                 datumMargin
#                                 bedrag
#                                 bedragMargin
#                                 byDay
#                                 byMonth
#                                 byMonthDay
#                             }
#                             alarm {
#                                 id
#                                 isActive
#                                 afspraak{
#                                     id
#                                 }
#                                 startDate
#                                 datumMargin
#                                 bedrag
#                                 bedragMargin
#                                 byDay
#                                 byMonth
#                                 byMonthDay
#                             }
#                         }
#                     }''',
#                 "variables": {
#                     "id": alarm_id,
#                     "input": input
#                 }
#             },
#             content_type='application/json'
#         )


#         # assert
#         assert fallback.called == 0
#         assert response.json["errors"][0]["message"] == expected

@freeze_time("2021-12-01")
def test_update_alarm_failure_cant_set_alarm_to_non_existing_afspraak(client):
    with requests_mock.Mocker() as rm:
        # arrange
        input = {
            "isActive": False,
            "afspraakId": 20,
            "startDate":"2021-12-02",
            "datumMargin": 1,
            "bedrag": "12.34",
            "bedragMargin":"56.78",
            "byDay": ["Thursday"]
        }
        expected = "Opgevraagde afspraken bestaan niet."
        alarm_id = "bd6222e7-bfab-46bc-b0bc-2b30b76228d4"
        alarm1 = {
            "id": alarm_id,
            "afspraakId": 19,
            "isActive": True,
            "startDate": "2021-12-07",
            "datumMargin": 5,
            "bedrag": "180012",
            "bedragMargin": "1000",
            "byDay": ["Thursday"]
        }

        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm0 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids=20", status_code=404)
        rm1 = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/?filter_ids={alarm_id}", status_code=200, json={"data": [alarm1]})

        # act
        response = client.post(
            "/graphql",
            json={
                "query": '''
                    mutation test($id:String!, $input:UpdateAlarmInput!) {
                        updateAlarm(id:$id, input:$input) {
                            ok
                            previous{
                                id
                                isActive
                                afspraak{
                                    id
                                }
                                startDate
                                datumMargin
                                bedrag
                                bedragMargin
                                byDay
                                byMonth
                                byMonthDay
                            }
                            alarm {
                                id
                                isActive
                                afspraak{
                                    id
                                }
                                startDate
                                datumMargin
                                bedrag
                                bedragMargin
                                byDay
                                byMonth
                                byMonthDay
                            }
                        }
                    }''',
                "variables": {
                    "id": alarm_id,
                    "input": input
                }
            },
            content_type='application/json'
        )

        # assert
        assert rm0.called_once
        assert rm1.called_once
        assert fallback.called == 0
        assert response.json["errors"][0]["message"] == expected
