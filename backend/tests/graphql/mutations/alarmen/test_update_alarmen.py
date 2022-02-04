import requests_mock
from hhb_backend.graphql import settings
from freezegun import freeze_time

@freeze_time("2021-12-01")
def test_update_alarm(client):
    with requests_mock.Mocker() as rm:
        # arrange
        input = {
            "gebruikerEmail":"other@mail.nl",
            "isActive": False,
            "afspraakId": 20,
            "datum":"2021-12-02",
            "datumMargin": 1,
            "bedrag": "12.34",
            "bedragMargin":"56.78"
        }
        expected = {'data': {'updateAlarm': {'ok': True, 'previous': {'id': 'bd6222e7-bfab-46bc-b0bc-2b30b76228d4', 'isActive': True, 'gebruikerEmail': 'test@mail.nl', 'afspraak': None, 'datum': '2021-12-07', 'datumMargin': 5, 'bedrag': '1800.12', 'bedragMargin': '10.00'}, 'alarm': {'id': 'bd6222e7-bfab-46bc-b0bc-2b30b76228d4', 'isActive': False, 'gebruikerEmail': 'other@mail.nl', 'afspraak': {'id': 20}, 'datum': '2021-12-02', 'datumMargin': 1, 'bedrag': '12.34', 'bedragMargin': '56.78'}}}}
        alarm_id = "bd6222e7-bfab-46bc-b0bc-2b30b76228d4"
        alarm1 = {
            "id": alarm_id,
            "gebruikerEmail": "test@mail.nl",
            "afspraakId": 19,
            "isActive": True,
            "datum": "2021-12-07",
            "datumMargin": 5,
            "bedrag": "180012",
            "bedragMargin": "1000"
        }
        afspraak = {
            "id": 20
        }
        updated_alarm = {
            "id": alarm_id,
            "gebruikerEmail": "other@mail.nl",
            "afspraakId": 20,
            "isActive": False,
            "datum":"2021-12-02",
            "datumMargin": 1,
            "bedrag": "1234",
            "bedragMargin":"5678"
        }
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm0 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/20", status_code=200)
        rm1 = rm.put(f"{settings.ALARMENSERVICE_URL}/alarms/{alarm_id}", status_code=200, json={ "ok":True, "data": updated_alarm})
        rm2 = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/{alarm_id}", status_code=200, json=alarm1)
        rm3 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201)
        rm4 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids=19,20", status_code=200, json={"data": [afspraak]})


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
                                gebruikerEmail
                                afspraak{
                                    id
                                }
                                datum
                                datumMargin
                                bedrag
                                bedragMargin
                            }
                            alarm {
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


@freeze_time("2021-12-01")
def test_update_alarm_failure_cant_set_alarm_in_past(client):
    with requests_mock.Mocker() as rm:
        # arrange
        input = {
            "gebruikerEmail":"other@mail.nl",
            "isActive": False,
            "afspraakId": 20,
            "datum":"2021-01-01",
            "datumMargin": 1,
            "bedrag": "12.34",
            "bedragMargin":"56.78"
        }
        alarm_id = "bd6222e7-bfab-46bc-b0bc-2b30b76228d4"
        expected = "Alarm datum is in het verleden."
        alarm_id = "bd6222e7-bfab-46bc-b0bc-2b30b76228d4"

        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)

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
                                gebruikerEmail
                                afspraak{
                                    id
                                }
                                datum
                                datumMargin
                                bedrag
                                bedragMargin
                            }
                            alarm {
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
                    "id": alarm_id,
                    "input": input
                }
            },
            content_type='application/json'
        )


        # assert
        assert fallback.called == 0
        assert response.json["errors"][0]["message"] == expected

@freeze_time("2021-12-01")
def test_update_alarm_failure_cant_set_alarm_to_non_existing_afspraak(client):
    with requests_mock.Mocker() as rm:
        # arrange
        input = {
            "gebruikerEmail":"other@mail.nl",
            "isActive": False,
            "afspraakId": 20,
            "datum":"2021-12-02",
            "datumMargin": 1,
            "bedrag": "12.34",
            "bedragMargin":"56.78"
        }
        expected = "Afspraak bestaat niet."
        alarm_id = "bd6222e7-bfab-46bc-b0bc-2b30b76228d4"
        alarm1 = {
            "id": alarm_id,
            "gebruikerEmail": "test@mail.nl",
            "afspraakId": 19,
            "isActive": True,
            "datum": "2021-12-07",
            "datumMargin": 5,
            "bedrag": "180012",
            "bedragMargin": "1000"
        }

        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm0 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/20", status_code=404)
        rm1 = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/{alarm_id}", status_code=200, json=alarm1)

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
                                gebruikerEmail
                                afspraak{
                                    id
                                }
                                datum
                                datumMargin
                                bedrag
                                bedragMargin
                            }
                            alarm {
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