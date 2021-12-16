import requests_mock
from hhb_backend.graphql import settings
from freezegun import freeze_time

@freeze_time("2021-12-01")
def test_create_alarm(client):
    with requests_mock.Mocker() as rm:
        # arrange
        input = {
            "isActive":True,
            "gebruikerEmail":"test_1@mail.nl",
            "afspraakId": 19,
            "datum":"2021-12-02",
            "datumMargin": 5,
            "bedrag":"120.12",
            "bedragMargin": "10.34",
            "byDay": ["Wednesday"]
        }
        afspraak_id = 19
        alarm = {
            "id": "bd6222e7-bfab-46bc-b0bc-2b30b76228d4",
            "gebruikerEmail": "test@mail.nl",
            "afspraakId": 19,
            "isActive": True,
            "datum": "2021-12-02",
            "datumMargin": 5,
            "bedrag": "12012",
            "bedragMargin": "1034",
            "byDay": ["Wednesday"]
        }
        afspraak = {
            "id": afspraak_id,
            "credit": False,
            "bedrag": 76532,
            "valid_from": "2021-01-01",
            "alarm_id": "bd6222e7-bfab-46bc-b0bc-2b30b76228d4"
        }
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm0 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/19", status_code=200, json={"data": afspraak})
        rm1 = rm.post(f"{settings.ALARMENSERVICE_URL}/alarms/", status_code=201, json={ "ok":True, "data": alarm})
        rm2 = rm.post(f"{settings.HHB_SERVICES_URL}/afspraken/19", status_code=200)
        rm3 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201)
        rm4 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids=19", status_code=200, json={"data": [afspraak]})
        expected = {'data': {'createAlarm': {'ok': True, 'alarm': {'id': 'bd6222e7-bfab-46bc-b0bc-2b30b76228d4', 'isActive': True, 'gebruikerEmail': 'test@mail.nl', 'afspraak': {'id': 19}, 'datum': '2021-12-02', 'datumMargin': 5, 'bedrag': '120.12', 'bedragMargin': '10.34', 'byDay': ['Wednesday'], 'byMonth': [], 'byMonthDay': []}}}}

        # act
        response = client.post(
            "/graphql",
            json={
                "query": '''
                    mutation test($input:CreateAlarmInput!) {
                        createAlarm(input:$input) {
                            ok
                            alarm{
                                id
                                isActive
                                gebruikerEmail
                                afspraak{
                                    id
                                }
                                datum
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


# cant create alarm to be in the past
@freeze_time("2021-12-01")
def test_create_alarm_failure_cant_create_alarm_in_past(client):
    with requests_mock.Mocker() as rm:
        # arrange
        input = {
            "isActive": True,
            "gebruikerEmail":"test_1@mail.nl",
            "afspraakId": 19,
            "datum":"2021-01-01",
            "datumMargin": 5,
            "bedrag":"120.12",
            "bedragMargin": "10.34",
            "byDay": ["Wednesday"]
        }
        expected = "Alarm datum is in het verleden."
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)

        # act
        response = client.post(
            "/graphql",
            json={
                "query": '''
                    mutation test($input:CreateAlarmInput!) {
                        createAlarm(input:$input) {
                            ok
                            alarm{
                                id
                                isActive
                                gebruikerEmail
                                afspraak{
                                    id
                                }
                                datum
                                datumMargin
                                bedrag
                                bedragMargin
                            }
                        }
                    }''',
                "variables": {
                    "input": input
                }
            },
            content_type='application/json'
        )

        # assert
        assert fallback.called == 0
        assert response.json["errors"][0]["message"] == expected

@freeze_time("2021-12-01")
def test_create_alarm_failure_afspraak_does_not_exist(client):
    with requests_mock.Mocker() as rm:
        # arrange
        input = {
            "isActive": True,
            "gebruikerEmail":"test_1@mail.nl",
            "afspraakId": 19,
            "datum":"2021-12-02",
            "datumMargin": 5,
            "bedrag":"120.12",
            "bedragMargin": "10.34",
            "byDay": ["Wednesday"]
        }
        expected = "Afspraak bestaat niet."
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm0 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/19", status_code=404)

        # act
        response = client.post(
            "/graphql",
            json={
                "query": '''
                    mutation test($input:CreateAlarmInput!) {
                        createAlarm(input:$input) {
                            ok
                            alarm{
                                id
                                isActive
                                gebruikerEmail
                                afspraak{
                                    id
                                }
                                datum
                                datumMargin
                                bedrag
                                bedragMargin
                            }
                        }
                    }''',
                "variables": {
                    "input": input
                }
            },
            content_type='application/json'
        )

        # assert
        assert rm0.called_once
        assert fallback.called == 0
        assert response.json["errors"][0]["message"] == expected
