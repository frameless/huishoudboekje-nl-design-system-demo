from datetime import datetime
import requests_mock
from hhb_backend.graphql import settings
from freezegun import freeze_time
from hhb_backend.graphql.mutations.alarmen.evaluate_alarm import EvaluateAlarm
import pytest

alarm_id = "00943958-8b93-4617-aa43-669a9016aad9"
afspraak_id = 19
journaalpost_id = 1
transaction_id = 10
banktransactie_id = 100
alarm = {
    "id": alarm_id,
    "isActive": True,
    "gebruikerEmail":"other@mail.nl",
    "afspraakId": 19,
    "datum":"2021-12-06",
    "datumMargin": 5,
    "bedrag": "12500",
    "bedragMargin":"1000",
    "byDay": ["Wednesday", "Friday"]
}
nextAlarm = {
    "id": "33738845-7f23-4c8f-8424-2b560a944884",
    "isActive": True,
    "gebruikerEmail":"other@mail.nl",
    "afspraakId": 19,
    "datum":"2021-12-08",
    "datumMargin": 5,
    "bedrag": "12500",
    "bedragMargin":"1000",
    "byDay": ["Wednesday", "Friday"]
}
afspraak = {
    "id": afspraak_id,
    "omschrijving": "this is a test afspraak",
    "aantal_betalingen": None,
    "afdeling_id": None,
    "bedrag": 120,
    "betaalinstructie": {
        "by_day": ["Wednesday", "Friday"],
        "start_date": "2019-01-01"
    },
    "burger_id": 2,
    "credit": False,
    "journaalposten": [journaalpost_id]
}
journaalpost = {
    "afspraak_id": afspraak_id,
    "grootboekrekening_id": "BEivKapProPok",
    "id": journaalpost_id,
    "is_automatisch_geboekt": True,
    "transaction_id": transaction_id
}
banktransactie = {
    "id": banktransactie_id,
    "bedrag": 120,
    "customer_statement_message_id": 15,
    "information_to_account_owner": "NL83ABNA1927261899               Leefgeld ZOEKTERMPERSONA2 januari 2019",
    "is_credit": False,
    "is_geboekt": True,
    "statement_line": "190101D-1195.20NMSC028",
    "tegen_rekening": "NL83ABNA1927261899",
    "transactie_datum": "2021-12-01"
}
signal = {
    "id": "e2b282d9-b31f-451e-9242-11f86c902b35",
    "alarmId": alarm_id,
    "isActive": True,
    "type": "default",
    "actions": [],
    "context": None,
    "timeCreated": "2021-12-13T13:20:40.784Z"
}
@freeze_time("2021-12-01")
@pytest.mark.parametrize(
    ["expected", "alarm", "alarmDate"], [
    (datetime(2021,12, 6), {"byDay": ["Monday"]}, (datetime(2021,12, 1))),
    (datetime(2021,12, 7), {"byDay": ["Tuesday"]}, (datetime(2021,12, 1))),
    (datetime(2021,12, 8), {"byDay": ["Wednesday"]}, (datetime(2021,12, 1))),
    (datetime(2021,12, 2), {"byDay": ["Thursday"]}, (datetime(2021,12, 1))),
    (datetime(2021,12, 3), {"byDay": ["Friday"]}, (datetime(2021,12, 1))),
    (datetime(2021,12, 4), {"byDay": ["Saturday"]}, (datetime(2021,12, 1))),
    (datetime(2021,12, 5), {"byDay": ["Sunday"]}, (datetime(2021,12, 1))),
])
def test_generateNextAlarmDate_weekly(expected: datetime, alarm, alarmDate):
    next_alarm_date = EvaluateAlarm.generateNextAlarmInSequence(alarm, alarmDate)
    assert next_alarm_date == expected.date()

@freeze_time("2021-12-01")
@pytest.mark.parametrize(
    ["expected", "alarm", "alarmDate"], [
    (datetime(2022,1, 1), {"byMonth": [1], "byMonthDay": [1]}, (datetime(2021,12, 1))),
    (datetime(2022,3, 10), {"byMonth": [3], "byMonthDay": [10, 15, 30]}, (datetime(2021,12, 1))),
    (datetime(2022,12, 1), {"byMonth": [12], "byMonthDay": [1]}, (datetime(2021,12, 1))),
    (datetime(2022,3, 1), {"byMonth": [3,4,5,6,7,8,9,10], "byMonthDay": [1]}, (datetime(2021,12, 1))),
    (datetime(2022,11, 30), {"byMonth": [11], "byMonthDay": [30]}, (datetime(2021,12, 1))),
    (datetime(2021,12, 2), {"byMonth": [12], "byMonthDay": [1,2,3,4,5]}, (datetime(2021,12, 1))),
])
def test_generateNextAlarmDate_monthly(expected: datetime, alarm, alarmDate: datetime):
    next_alarm_date = EvaluateAlarm.generateNextAlarmInSequence(alarm, alarmDate)
    assert next_alarm_date == expected.date()

@freeze_time("2021-12-01")
@pytest.mark.parametrize(
    ["expected", "alarm"], [
    (True, { "isActive": True, "datum":"2021-12-01" }),
    (True, { "isActive": True, "datum":"2021-12-01" }),
    (False, { "isActive": True, "datum":"2021-11-30" }),
    (False, { "isActive": True, "datum":"2021-12-02" }),
])
def test_shouldCheckAlarm(expected: bool, alarm):
    actual = EvaluateAlarm.shouldCheckAlarm(alarm)
    assert actual == expected

# @TODO Ik denk dat er al eerder moet worden getest of het allemaal goed is, dus al bij creatie testen of byDay of byMonth en byMonthDay is ingevuld, niet pas bij het evalueren.
@freeze_time("2021-12-06")
def test_evaluate_alarm_illigal_betaalinstructie_combination(client):
    with requests_mock.Mocker() as rm:
        # arrange
        alarm = {
            "id": alarm_id,
            "isActive": True,
            "gebruikerEmail":"other@mail.nl",
            "afspraakId": 19,
            "datum":"2021-12-06",
            "datumMargin": 5,
            "bedrag": "12500",
            "bedragMargin":"1000",
            "byDay": ["Wednesday", "Friday"],
            "byMonth": [1],
            "byMonthDay": [1],
        }
        expected = "Niet ondersteunde combinatie van alarm herhaal instructies. isWeekly:False isMonthly:False byDay:['Wednesday', 'Friday'] byMonth:[1] byMonthDay:[1]"

        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/", status_code=200, json={'data': [alarm]})
        rm2 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/{afspraak_id}", status_code=200, json={"data":afspraak})
        rm3 = rm.get(f"{settings.HHB_SERVICES_URL}/journaalposten/{journaalpost_id}", status_code=200, json={"data": journaalpost})
        rm4 = rm.get(f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/{transaction_id}", status_code=200, json={"data": banktransactie})

        # act
        response = client.post(
            "/graphql",
            json={
                "query": '''
                    mutation test {
                        evaluateAlarm {
                            alarmTriggerResult {
                                alarm {
                                    id
                                }
                                nextAlarm{
                                    id
                                }
                                Signal{
                                    id
                                }
                            }
                        }
                    }''',
            },
            content_type='application/json'
        )

        # assert
        print(f">> >> >> >> response: {response.json} ")
        for call in rm.request_history:
            print(f">> >> >> >> fallback: {call.method} {call.url} ")

        assert rm1.called_once
        assert rm2.called_once
        assert rm3.called_once
        assert rm4.called_once
        assert fallback.called == 0
        assert response.json.get("errors")[0].get("message") == expected

@freeze_time("2021-12-06")
def test_evaluate_alarm_inactive(client):
    with requests_mock.Mocker() as rm:
        # arrange
        alarm = {
            "id": alarm_id,
            "isActive":False,
            "gebruikerEmail":"other@mail.nl",
            "afspraakId": 19,
            "datum":"2021-12-06",
            "datumMargin": 5,
            "bedrag": "12500",
            "bedragMargin":"1000",
            "byDay": ["Wednesday", "Friday"]
        }
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/", status_code=200, json={'data': [alarm]})
        rm2 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201)
        expected = {'data': {'evaluateAlarm': {'alarmTriggerResult': []}}}

        # act
        response = client.post(
            "/graphql",
            json={
                "query": '''
                    mutation test {
                        evaluateAlarm {
                            alarmTriggerResult {
                                alarm {
                                    id
                                }
                                nextAlarm{
                                    id
                                }
                                Signal{
                                    id
                                }
                            }
                        }
                    }''',
            },
            content_type='application/json'
        )

        # assert
        assert rm1.called_once
        assert rm2.called_once
        assert fallback.called == 0
        assert response.json == expected

@freeze_time("2021-12-06")
def test_evaluate_alarm_no_signal(client):
    with requests_mock.Mocker() as rm:
        # arrange
        expected = {'data': {'evaluateAlarm': {'alarmTriggerResult': [{'alarm': {'id': '00943958-8b93-4617-aa43-669a9016aad9'}, 'nextAlarm': {'id': '33738845-7f23-4c8f-8424-2b560a944884'}, 'Signal': None}]}}}
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/", status_code=200, json={'data': [alarm]})
        rm2 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/{afspraak_id}", status_code=200, json={"data":afspraak})
        rm3 = rm.get(f"{settings.HHB_SERVICES_URL}/journaalposten/{journaalpost_id}", status_code=200, json={"data": journaalpost})
        rm4 = rm.get(f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/{transaction_id}", status_code=200, json={"data": banktransactie})
        rm5 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201)
        rm6 = rm.post(f"{settings.ALARMENSERVICE_URL}/alarms/", status_code=201, json={ "ok":True, "data": nextAlarm})

        # act
        response = client.post(
            "/graphql",
            json={
                "query": '''
                    mutation test {
                        evaluateAlarm {
                            alarmTriggerResult {
                                alarm {
                                    id
                                }
                                nextAlarm{
                                    id
                                }
                                Signal{
                                    id
                                }
                            }
                        }
                    }''',
            },
            content_type='application/json'
        )

        # assert
        assert rm1.called_once
        assert rm2.called_once
        assert rm3.called_once
        assert rm4.called_once
        assert rm5.called_once
        assert rm6.called_once
        assert fallback.called == 0
        assert response.json == expected

@freeze_time("2021-12-06")
def test_evaluate_alarm_signal_date(client):
    with requests_mock.Mocker() as rm:
        # arrange
        banktransactie = {
            "id": banktransactie_id,
            "bedrag": 150,
            "customer_statement_message_id": 15,
            "information_to_account_owner": "NL83ABNA1927261899               Leefgeld ZOEKTERMPERSONA2 januari 2019",
            "is_credit": False,
            "is_geboekt": True,
            "statement_line": "190101D-1195.20NMSC028",
            "tegen_rekening": "NL83ABNA1927261899",
            "transactie_datum": "2021-11-11"
        }
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/", status_code=200, json={'data': [alarm]})
        rm2 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/{afspraak_id}", status_code=200, json={"data":afspraak})
        rm3 = rm.get(f"{settings.HHB_SERVICES_URL}/journaalposten/{journaalpost_id}", status_code=200, json={"data": journaalpost})
        rm4 = rm.get(f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/{transaction_id}", status_code=200, json={"data": banktransactie})
        rm5 = rm.post(f"{settings.ALARMENSERVICE_URL}/alarms/", status_code=201, json={ "ok":True, "data": nextAlarm})
        rm6 = rm.post(f"{settings.SIGNALENSERVICE_URL}/signals/", status_code=201, json={"data": signal})
        rm7 = rm.put(f"{settings.ALARMENSERVICE_URL}/alarms/{alarm_id}", status_code=200, json={ "ok":True, "data": nextAlarm})
        rm8 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201)
        expected = {'data': {'evaluateAlarm': {'alarmTriggerResult': [{'alarm': {'id': '00943958-8b93-4617-aa43-669a9016aad9'}, 'nextAlarm': {'id': '33738845-7f23-4c8f-8424-2b560a944884'}, 'Signal': {'id': 'e2b282d9-b31f-451e-9242-11f86c902b35'}}]}}}

        # act
        response = client.post(
            "/graphql",
            json={
                "query": '''
                    mutation test {
                        evaluateAlarm {
                            alarmTriggerResult {
                                alarm {
                                    id
                                }
                                nextAlarm{
                                    id
                                }
                                Signal{
                                    id
                                }
                            }
                        }
                    }''',
            },
            content_type='application/json'
        )

        # assert
        assert rm1.called_once
        assert rm2.called_once
        assert rm3.called_once
        assert rm4.called_once
        assert rm5.called_once
        assert rm6.called_once
        assert rm7.called_once
        assert rm8.called_once
        assert fallback.called == 0
        assert response.json == expected

@freeze_time("2021-12-06")
def test_evaluate_alarm_signal_monetary(client):
    with requests_mock.Mocker() as rm:
        # arrange
        banktransactie = {
            "id": banktransactie_id,
            "bedrag": 150,
            "customer_statement_message_id": 15,
            "information_to_account_owner": "NL83ABNA1927261899               Leefgeld ZOEKTERMPERSONA2 januari 2019",
            "is_credit": False,
            "is_geboekt": True,
            "statement_line": "190101D-1195.20NMSC028",
            "tegen_rekening": "NL83ABNA1927261899",
            "transactie_datum": "2021-12-01"
        }
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/", status_code=200, json={'data': [alarm]})
        rm2 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/{afspraak_id}", status_code=200, json={"data":afspraak})
        rm3 = rm.get(f"{settings.HHB_SERVICES_URL}/journaalposten/{journaalpost_id}", status_code=200, json={"data": journaalpost})
        rm4 = rm.get(f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/{transaction_id}", status_code=200, json={"data": banktransactie})
        rm5 = rm.post(f"{settings.ALARMENSERVICE_URL}/alarms/", status_code=201, json={ "ok":True, "data": nextAlarm})
        rm6 = rm.post(f"{settings.SIGNALENSERVICE_URL}/signals/", status_code=201, json={"data": signal})
        rm7 = rm.put(f"{settings.ALARMENSERVICE_URL}/alarms/{alarm_id}", status_code=200, json={ "ok":True, "data": nextAlarm})
        rm8 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201)
        expected = {'data': {'evaluateAlarm': {'alarmTriggerResult': [{'alarm': {'id': '00943958-8b93-4617-aa43-669a9016aad9'}, 'nextAlarm': {'id': '33738845-7f23-4c8f-8424-2b560a944884'}, 'Signal': {'id': 'e2b282d9-b31f-451e-9242-11f86c902b35'}}]}}}

        # act
        response = client.post(
            "/graphql",
            json={
                "query": '''
                    mutation test {
                        evaluateAlarm {
                            alarmTriggerResult {
                                alarm {
                                    id
                                }
                                nextAlarm{
                                    id
                                }
                                Signal{
                                    id
                                }
                            }
                        }
                    }''',
            },
            content_type='application/json'
        )

        # assert
        assert rm1.called_once
        assert rm2.called_once
        assert rm3.called_once
        assert rm4.called_once
        assert rm5.called_once
        assert rm6.called_once
        assert rm7.called_once
        assert rm8.called_once
        assert fallback.called == 0
        assert response.json == expected

@freeze_time("2021-12-06")
def test_evaluate_alarm_next_alarm_in_sequence_already_exists(client):
    with requests_mock.Mocker() as rm:
        # arrange
        alarm = {
            "id": alarm_id,
            "isActive": True,
            "gebruikerEmail":"other@mail.nl",
            "afspraakId": 19,
            "datum":"2021-12-06",
            "datumMargin": 1,
            "bedrag": "12500",
            "bedragMargin":"1000",
            "byDay": ["Wednesday", "Friday"]
        }
        next_alarm = {
            "id": "10943958-8b93-4617-aa43-669a9016aad9",
            "isActive": True,
            "gebruikerEmail":"other@mail.nl",
            "afspraakId": 19,
            "datum":"2021-12-08",
            "datumMargin": 1,
            "bedrag": "12500",
            "bedragMargin":"1000",
            "byDay": ["Wednesday", "Friday"]
        }
        banktransactie = {
            "id": banktransactie_id,
            "bedrag": 120,
            "customer_statement_message_id": 15,
            "information_to_account_owner": "NL83ABNA1927261899               Leefgeld ZOEKTERMPERSONA2 januari 2019",
            "is_credit": False,
            "is_geboekt": True,
            "statement_line": "190101D-1195.20NMSC028",
            "tegen_rekening": "NL83ABNA1927261899",
            "transactie_datum": "2021-12-05"
        }
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/", status_code=200, json={'data': [alarm, next_alarm]})
        rm2 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/{afspraak_id}", status_code=200, json={"data":afspraak})
        rm3 = rm.get(f"{settings.HHB_SERVICES_URL}/journaalposten/{journaalpost_id}", status_code=200, json={"data": journaalpost})
        rm4 = rm.get(f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/{transaction_id}", status_code=200, json={"data": banktransactie})
        rm5 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201)
        rm6 = rm.post(f"{settings.ALARMENSERVICE_URL}/alarms/", status_code=201, json={ "ok":True, "data": nextAlarm})
        expected = {'data': {'evaluateAlarm': {'alarmTriggerResult': [{'alarm': {'id': '00943958-8b93-4617-aa43-669a9016aad9'}, 'nextAlarm': None, 'Signal': None}, {'alarm': {'id': '10943958-8b93-4617-aa43-669a9016aad9'}, 'nextAlarm': {'id': '33738845-7f23-4c8f-8424-2b560a944884'}, 'Signal': None}]}}}

        # act
        response = client.post(
            "/graphql",
            json={
                "query": '''
                    mutation test {
                        evaluateAlarm {
                            alarmTriggerResult {
                                alarm {
                                    id
                                }
                                nextAlarm{
                                    id
                                }
                                Signal{
                                    id
                                }
                            }
                        }
                    }''',
            },
            content_type='application/json'
        )

        # assert
        assert rm1.call_count == 1
        assert rm2.call_count == 2
        assert rm3.call_count == 2
        assert rm4.call_count == 2
        assert rm5.call_count == 1
        assert rm6.call_count == 1
        assert fallback.call_count == 0
        assert response.json == expected

@freeze_time("2021-12-10")
def test_evaluate_alarm_disabled_because_its_in_the_past(client):
    with requests_mock.Mocker() as rm:
        # arrange
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/", status_code=200, json={'data': [alarm]})
        rm2 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/{afspraak_id}", status_code=200, json={"data":afspraak})
        rm3 = rm.get(f"{settings.HHB_SERVICES_URL}/journaalposten/{journaalpost_id}", status_code=200, json={"data": journaalpost})
        rm4 = rm.get(f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/{transaction_id}", status_code=200, json={"data": banktransactie})
        rm5 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201)
        rm6 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids={afspraak_id}", status_code=200, json={"data": [afspraak]})
        rm7 = rm.post(f"{settings.ALARMENSERVICE_URL}/alarms/", status_code=201, json={ "ok":True, "data": nextAlarm})
        expected = {'data': {'evaluateAlarm': {'alarmTriggerResult': [{'alarm': {'isActive': False, 'gebruikerEmail': 'other@mail.nl', 'afspraak': {'id': 19, 'omschrijving': 'this is a test afspraak', 'betaalinstructie': {'byDay': ['Wednesday', 'Friday'], 'byMonth': [], 'byMonthDay': []}}, 'datum': '2021-12-06', 'datumMargin': 5, 'bedrag': '125.00', 'bedragMargin': '10.00'}, 'nextAlarm': {'isActive': True, 'gebruikerEmail': 'other@mail.nl', 'afspraak': {'id': 19, 'omschrijving': 'this is a test afspraak', 'betaalinstructie': {'byDay': ['Wednesday', 'Friday'], 'byMonth': [], 'byMonthDay': []}}, 'datum': '2021-12-08', 'datumMargin': 5, 'bedrag': '125.00', 'bedragMargin': '10.00'}, 'Signal': None}]}}}

        # act
        response = client.post(
            "/graphql",
            json={
                "query": '''
                    mutation test {
                        evaluateAlarm {
                            alarmTriggerResult {
                                alarm {
                                    isActive
                                    gebruikerEmail
                                    afspraak{
                                        id
                                        omschrijving
                                        betaalinstructie{
                                            byDay
                                            byMonth
                                            byMonthDay
                                        }
                                    }
                                    datum
                                    datumMargin
                                    bedrag
                                    bedragMargin
                                }
                                nextAlarm{
                                    isActive
                                    gebruikerEmail
                                    afspraak{
                                        id
                                        omschrijving
                                        betaalinstructie{
                                            byDay
                                            byMonth
                                            byMonthDay
                                        }
                                    }
                                    datum
                                    datumMargin
                                    bedrag
                                    bedragMargin
                                }
                                Signal{
                                    id
                                }
                            }
                        }
                    }''',
            },
            content_type='application/json'
        )

        # assert
        assert rm1.called_once
        assert rm2.called_once
        assert rm3.called_once
        assert rm4.called_once
        assert rm5.called_once
        assert rm6.called_once
        assert rm7.called_once
        assert fallback.called == 0
        assert response.json == expected