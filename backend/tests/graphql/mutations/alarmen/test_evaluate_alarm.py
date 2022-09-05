from datetime import datetime

import pytest
import requests_mock
from freezegun import freeze_time

import hhb_backend.graphql.mutations.alarmen.evaluate_alarm as EvaluateAlarm
from hhb_backend.graphql import settings
from hhb_backend.graphql.mutations.alarmen.alarm import generate_alarm_date

alarm_id = "00943958-8b93-4617-aa43-669a9016aad9"
afspraak_id = 19
journaalpost_id = 1
transaction_id = 10
banktransactie_id = 100
alarm = {
    "id": alarm_id,
    "isActive": True,
    "afspraakId": 19,
    "startDate":"2021-12-06",
    "datumMargin": 1,
    "bedrag": 12500,
    "bedragMargin":1000,
    "byDay": ["Wednesday", "Friday"],
    "byMonth": [],
    "byMonthDay": []
}
nextAlarm = {
    "id": "33738845-7f23-4c8f-8424-2b560a944884",
    "isActive": True,
    "afspraakId": 19,
    "startDate":"2021-12-08",
    "datumMargin": 1,
    "bedrag": 12500,
    "bedragMargin":1000,
    "byDay": ["Wednesday", "Friday"],
    "byMonth": [],
    "byMonthDay": []
}
afspraak = {
    "id": afspraak_id,
    "omschrijving": "this is a test afspraak",
    "valid_from": "2021-01-01",
    "aantal_betalingen": None,
    "afdeling_id": None,
    "bedrag": 12000,
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
    "bedrag": 12000,
    "customer_statement_message_id": 15,
    "information_to_account_owner": "NL83ABNA1927261899               Leefgeld ZOEKTERMPERSONA2 januari 2019",
    "is_credit": False,
    "is_geboekt": True,
    "statement_line": "190101D-1195.20NMSC028",
    "tegen_rekening": "NL83ABNA1927261899",
    "transactie_datum": "2021-12-05"
}
signaal = {
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
    next_alarm_date = generate_alarm_date(alarm, alarmDate)
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
    next_alarm_date = generate_alarm_date(alarm, alarmDate)
    assert next_alarm_date == expected.date()


@freeze_time("2021-12-01")
@pytest.mark.parametrize(
    ["expected", "alarm"], [
    (False, { "isActive": True, "startDate":"2021-12-01", "datumMargin":0 }),
    (False, { "isActive": True, "startDate":"2021-12-01", "datumMargin":1  }),
    (True, { "isActive": True, "startDate":"2021-11-30", "datumMargin":0 }),
    (False, { "isActive": True, "startDate":"2021-11-30", "datumMargin":1  }),
    (False, { "isActive": True, "startDate":"2021-12-02", "datumMargin":1  }),
    (True, { "isActive": True, "startDate":"2021-11-25", "datumMargin":1 })
])
def test_shouldCheckAlarm(expected: bool, alarm):
    actual = EvaluateAlarm.shouldCheckAlarm(alarm)
    assert actual == expected


@freeze_time("2021-12-08")
def test_evaluate_alarm_illigal_betaalinstructie_combination(client):
    with requests_mock.Mocker() as rm:
        # arrange
        alarm = {
            "id": alarm_id,
            "isActive": True,
            "afspraakId": 19,
            "startDate":"2021-12-06",
            "datumMargin": 1,
            "bedrag": 12500,
            "bedragMargin":1000,
            "byDay": ["Wednesday", "Friday"],
            "byMonth": [1],
            "byMonthDay": [1],
        }
        expected = "Niet ondersteunde combinatie van alarm herhaal instructies. isWeekly:False isMonthly:False byDay:['Wednesday', 'Friday'] byMonth:[1] byMonthDay:[1]"

        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/", status_code=200, json={'data': [alarm]})
        rm2 = rm.get(
            f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids={afspraak_id}",
            json={"data": [afspraak]}
        )
        rm3 = rm.get(
            f"{settings.HHB_SERVICES_URL}/journaalposten/?filter_ids={journaalpost_id}",
            json={"data": [journaalpost]}
        )
        rm4 = rm.get(
            f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_ids={transaction_id}",
            json={"data": [banktransactie]}
        )

        # act
        response = client.post(
            "/graphql",
            json={
                "query": '''
                    mutation test {
                        evaluateAlarms {
                            alarmTriggerResult {
                                alarm {
                                    id
                                }
                                nextAlarm{
                                    id
                                }
                                signaal{
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


@freeze_time("2021-12-08")
def test_evaluate_alarm_inactive(client):
    with requests_mock.Mocker() as rm:
        # arrange
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/?is_active=True", json={'data': []})
        rm2 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201)
        expected = {'data': {'evaluateAlarms': {'alarmTriggerResult': []}}}

        # act
        response = client.post(
            "/graphql",
            json={
                "query": '''
                    mutation test {
                        evaluateAlarms {
                            alarmTriggerResult {
                                alarm {
                                    id
                                }
                                nextAlarm{
                                    id
                                }
                                signaal{
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


@freeze_time("2021-12-08")
def test_evaluate_alarm_no_signal(client):
    with requests_mock.Mocker() as rm:
        # arrange
        expected = {'data': {'evaluateAlarms': {'alarmTriggerResult': [{'alarm': {'id': '00943958-8b93-4617-aa43-669a9016aad9'}, 'nextAlarm': {'id': '33738845-7f23-4c8f-8424-2b560a944884'}, 'signaal': None}]}}}
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/?is_active=True", json={'data': [alarm]})
        rm2 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids={afspraak_id}", json={"data": [afspraak]})
        rm3 = rm.get(
            f"{settings.HHB_SERVICES_URL}/journaalposten/?filter_ids={journaalpost_id}",
            json={"data": [journaalpost]}
        )
        rm4 = rm.get(
            f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_ids={transaction_id}",
            json={"data": [banktransactie]}
        )
        rm5 = rm.post(f"{settings.ALARMENSERVICE_URL}/alarms/", status_code=201, json={"ok": True, "data": nextAlarm})
        rm6 = rm.post(f"{settings.HHB_SERVICES_URL}/afspraken/{afspraak_id}")
        rm7 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201)

        # act
        response = client.post(
            "/graphql",
            json={
                "query": '''
                    mutation test {
                        evaluateAlarms {
                            alarmTriggerResult {
                                alarm {
                                    id
                                }
                                nextAlarm{
                                    id
                                }
                                signaal{
                                    id
                                }
                            }
                        }
                    }''',
            },
            content_type='application/json'
        )

        print(f">> >> >> response: {response.json} ")
        
        # assert
        assert rm1.call_count == 1
        assert rm2.call_count == 2
        assert rm3.call_count == 1
        assert rm4.call_count == 1
        assert rm5.call_count == 1
        assert rm6.call_count == 1
        assert rm7.call_count == 2
        assert fallback.called == 0
        assert response.json == expected


@freeze_time("2021-12-08")
def test_evaluate_alarm_signal_date(client):
    with requests_mock.Mocker() as rm:
        # arrange
        banktransactie = {
            "id": banktransactie_id,
            "bedrag": 15000,
            "customer_statement_message_id": 15,
            "information_to_account_owner": "NL83ABNA1927261899               Leefgeld ZOEKTERMPERSONA2 januari 2019",
            "is_credit": False,
            "is_geboekt": True,
            "statement_line": "190101D-1195.20NMSC028",
            "tegen_rekening": "NL83ABNA1927261899",
            "transactie_datum": "2021-11-11"
        }
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/?is_active=True", json={'data': [alarm]})
        rm2 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids={afspraak_id}", json={"data":[afspraak]})
        rm3 = rm.get(
            f"{settings.HHB_SERVICES_URL}/journaalposten/?filter_ids={journaalpost_id}",
            json={"data": [journaalpost]}
        )
        rm4 = rm.get(
            f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_ids={transaction_id}",
            json={"data": [banktransactie]}
        )
        rm5 = rm.post(f"{settings.ALARMENSERVICE_URL}/alarms/", status_code=201, json={"ok": True, "data": nextAlarm})
        rm6 = rm.post(f"{settings.SIGNALENSERVICE_URL}/signals/", status_code=201, json={"data": signaal})
        rm7 = rm.put(f"{settings.ALARMENSERVICE_URL}/alarms/{alarm_id}", json={"ok": True, "data": nextAlarm})
        rm8 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201)
        rm9 = rm.post(f"{settings.HHB_SERVICES_URL}/afspraken/{afspraak_id}")

        # act
        response = client.post(
            "/graphql",
            json={
                "query": '''
                    mutation test {
                        evaluateAlarms {
                            alarmTriggerResult {
                                alarm {
                                    id
                                }
                                nextAlarm{
                                    id
                                }
                                signaal{
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
        assert rm3.call_count == 1
        assert rm4.call_count == 1
        assert rm5.call_count == 1
        assert rm6.call_count == 1
        assert rm7.call_count == 1
        assert rm8.call_count == 3
        assert rm9.call_count == 1
        assert fallback.called == 0
        assert response.json == {'data': {
            'evaluateAlarms': {
                'alarmTriggerResult': [{
                    'alarm': {'id': '00943958-8b93-4617-aa43-669a9016aad9'},
                    'nextAlarm': {'id': '33738845-7f23-4c8f-8424-2b560a944884'},
                    'signaal': {'id': 'e2b282d9-b31f-451e-9242-11f86c902b35'}
                }]
            }
        }}


@freeze_time("2021-12-08")
def test_evaluate_alarm_signal_monetary(client):
    with requests_mock.Mocker() as rm:
        # arrange
        banktransactie = {
            "id": banktransactie_id,
            "bedrag": 15000,
            "customer_statement_message_id": 15,
            "information_to_account_owner": "NL83ABNA1927261899               Leefgeld ZOEKTERMPERSONA2 januari 2019",
            "is_credit": False,
            "is_geboekt": True,
            "statement_line": "190101D-1195.20NMSC028",
            "tegen_rekening": "NL83ABNA1927261899",
            "transactie_datum": "2021-12-05"
        }
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/?is_active=True", json={'data': [alarm]})
        rm2 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids={afspraak_id}", json={"data":[afspraak]})
        rm3 = rm.get(
            f"{settings.HHB_SERVICES_URL}/journaalposten/?filter_ids={journaalpost_id}",
            json={"data": [journaalpost]}
        )
        rm4 = rm.get(
            f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_ids={transaction_id}",
            json={"data": [banktransactie]}
        )
        rm5 = rm.post(f"{settings.ALARMENSERVICE_URL}/alarms/", status_code=201, json={"ok": True, "data": nextAlarm})
        rm6 = rm.post(f"{settings.SIGNALENSERVICE_URL}/signals/", status_code=201, json={"data": signaal})
        rm7 = rm.put(f"{settings.ALARMENSERVICE_URL}/alarms/{alarm_id}", json={"ok": True, "data": nextAlarm})
        rm8 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201)
        rm9 = rm.post(f"{settings.HHB_SERVICES_URL}/afspraken/{afspraak_id}")

        # act
        response = client.post(
            "/graphql",
            json={
                "query": '''
                    mutation test {
                        evaluateAlarms {
                            alarmTriggerResult {
                                alarm {
                                    id
                                }
                                nextAlarm{
                                    id
                                }
                                signaal{
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
        assert rm3.call_count == 1
        assert rm4.call_count == 1
        assert rm5.call_count == 1
        assert rm6.call_count == 1
        assert rm7.call_count == 1
        assert rm8.call_count == 3
        assert rm9.call_count == 1
        assert fallback.called == 0
        assert response.json == {'data': {
            'evaluateAlarms': {
                'alarmTriggerResult': [{
                    'alarm': {'id': '00943958-8b93-4617-aa43-669a9016aad9'},
                    'nextAlarm': {'id': '33738845-7f23-4c8f-8424-2b560a944884'},
                    'signaal': {'id': 'e2b282d9-b31f-451e-9242-11f86c902b35'}
                }]
            }
        }}

# Tried making a test to retrieve the bank transactions in the created signal, but it is not working...
# @freeze_time("2021-12-08")
# def test_evaluate_alarm_signal_monetary_multiple_transactions(client):
#     with requests_mock.Mocker() as rm:
#         # arrange
#         banktransactie = {
#             "id": banktransactie_id,
#             "bedrag": 15000,
#             "customer_statement_message_id": 15,
#             "information_to_account_owner": "NL83ABNA1927261899               Leefgeld ZOEKTERMPERSONA2 januari 2019",
#             "is_credit": False,
#             "is_geboekt": True,
#             "statement_line": "190101D-1195.20NMSC028",
#             "tegen_rekening": "NL83ABNA1927261899",
#             "transactie_datum": "2021-12-05"
#         }
#         signaal = {
#             "id": "e2b282d9-b31f-451e-9242-11f86c902b35",
#             "alarmId": alarm_id,
#             "banktransactieIds": [banktransactie_id],
#             "isActive": True,
#             "type": "default",
#             "actions": [],
#             "context": None,
#             "timeCreated": "2021-12-13T13:20:40.784Z"
#         }
#         fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
#         rm1 = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/?is_active=True", status_code=200, json={'data': [alarm]})
#         rm2 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids={afspraak_id}", status_code=200, json={"data":[afspraak]})
#         rm3 = rm.get(f"{settings.HHB_SERVICES_URL}/journaalposten/?filter_ids={journaalpost_id}", status_code=200, json={"data": [journaalpost]})
#         rm4 = rm.get(f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_ids={transaction_id}", status_code=200, json={"data": [banktransactie]})
#         rm5 = rm.post(f"{settings.ALARMENSERVICE_URL}/alarms/", status_code=201, json={ "ok":True, "data": nextAlarm})
#         rm6 = rm.post(f"{settings.SIGNALENSERVICE_URL}/signals/", status_code=201, json={"data": signaal})
#         rm7 = rm.put(f"{settings.ALARMENSERVICE_URL}/alarms/{alarm_id}", status_code=200, json={ "ok":True, "data": nextAlarm})
#         rm8 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201)
#         expected = {'data': {'evaluateAlarm': {'alarmTriggerResult': [{'alarm': {'id': '00943958-8b93-4617-aa43-669a9016aad9'}, 'nextAlarm': {'id': '33738845-7f23-4c8f-8424-2b560a944884'}, 
#         'signaal': {'id': 'e2b282d9-b31f-451e-9242-11f86c902b35', 'bankTransactions': [{'id': "10"}]}}]}}}

#         # act
#         response = client.post(
#             "/graphql",
#             json={
#                 "query": '''
#                     mutation test {
#                         evaluateAlarm {
#                             alarmTriggerResult {
#                                 alarm {
#                                     id
#                                 }
#                                 nextAlarm{
#                                     id
#                                 }
#                                 signaal{
#                                     id
#                                     bankTransactions {
#                                         id
#                                     }
#                                 }
#                             }
#                         }
#                     }''',
#             },
#             content_type='application/json'
#         )

#         print(f">> >> >> response {response.json} ")

#         # assert
#         assert rm1.called_once
#         assert rm2.called_once
#         assert rm3.called_once
#         assert rm4.called_once
#         assert rm5.called_once
#         assert rm6.called_once
#         assert rm7.called_once
#         assert rm8.called_once
#         assert fallback.called == 0
#         assert response.json == expected


# Tests if alarm next in sequence already exists and that an alarm in the future does not create a next in sequence alarm yet.
@freeze_time("2021-12-08")
def test_evaluate_alarm_next_alarm_in_sequence_already_exists(client):
    with requests_mock.Mocker() as rm:
        # arrange
        alarm = {
            "id": alarm_id,
            "isActive": True,
            "afspraakId": 19,
            "startDate":"2021-12-06",
            "datumMargin": 1,
            "bedrag": 12500,
            "bedragMargin":1000,
            "byDay": ["Wednesday", "Friday"]
        }
        next_alarm = {
            "id": "10943958-8b93-4617-aa43-669a9016aad9",
            "isActive": True,
            "afspraakId": 19,
            "startDate":"2021-12-10",
            "datumMargin": 1,
            "bedrag": 12500,
            "bedragMargin":1000,
            "byDay": ["Wednesday", "Friday"]
        }
        banktransactie = {
            "id": banktransactie_id,
            "bedrag": 12000,
            "customer_statement_message_id": 15,
            "information_to_account_owner": "NL83ABNA1927261899               Leefgeld ZOEKTERMPERSONA2 januari 2019",
            "is_credit": False,
            "is_geboekt": True,
            "statement_line": "190101D-1195.20NMSC028",
            "tegen_rekening": "NL83ABNA1927261899",
            "transactie_datum": "2021-12-05"
        }
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(
            f"{settings.ALARMENSERVICE_URL}/alarms/?is_active=True", status_code=200,
            json={'data': [alarm, next_alarm]}
        )
        rm2 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids={afspraak_id}", json={"data":[afspraak]})
        rm3 = rm.get(
            f"{settings.HHB_SERVICES_URL}/journaalposten/?filter_ids={journaalpost_id}",
            json={"data": [journaalpost]}
        )
        rm4 = rm.get(
            f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_ids={transaction_id}",
            json={"data": [banktransactie]}
        )
        rm5 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201)

        # act
        response = client.post(
            "/graphql",
            json={
                "query": '''
                    mutation test {
                        evaluateAlarms {
                            alarmTriggerResult {
                                alarm {
                                    id
                                }
                                nextAlarm{
                                    id
                                }
                                signaal{
                                    id
                                }
                            }
                        }
                    }''',
            },
            content_type='application/json'
        )

        print(f">> >> >> response: {response.json} ")

        # assert
        assert rm1.call_count == 1
        assert rm2.call_count == 2
        assert rm3.call_count == 2
        assert rm4.call_count == 2
        assert rm5.call_count == 1
        assert fallback.call_count == 0
        assert response.json == {'data': {
            'evaluateAlarms': {
                'alarmTriggerResult': [
                    {
                        'alarm': {'id': '00943958-8b93-4617-aa43-669a9016aad9'},
                        'nextAlarm': None,
                        'signaal': None
                    },
                    {
                        'alarm': {'id': '10943958-8b93-4617-aa43-669a9016aad9'},
                        'nextAlarm': None,
                        'signaal': None
                    }
                ]
            }
        }}


# Test if an alarm in the past gets disabled and still creates a next in sequence alarm
@freeze_time("2021-12-13")
def test_evaluate_alarm_disabled_because_its_in_the_past(client):
    with requests_mock.Mocker() as rm:
        # arrange
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/?is_active=True", json={'data': [alarm]})
        rm2 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids={afspraak_id}", json={"data":[afspraak]})
        rm3 = rm.get(
            f"{settings.HHB_SERVICES_URL}/journaalposten/?filter_ids={journaalpost_id}",
            json={"data": [journaalpost]}
        )
        rm4 = rm.get(
            f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_ids={transaction_id}",
            json={"data": [banktransactie]}
        )
        rm5 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201)
        rm6 = rm.post(f"{settings.ALARMENSERVICE_URL}/alarms/", status_code=201, json={"ok": True, "data": nextAlarm})
        rm7 = rm.post(f"{settings.HHB_SERVICES_URL}/afspraken/{afspraak_id}")

        # act
        response = client.post(
            "/graphql",
            json={
                "query": '''
                    mutation test {
                        evaluateAlarms {
                            alarmTriggerResult {
                                alarm {
                                    isActive
                                    startDate
                                    datumMargin
                                    bedrag
                                    bedragMargin
                                    byDay
                                }
                                nextAlarm{
                                    isActive
                                    startDate
                                    datumMargin
                                    bedrag
                                    bedragMargin
                                    byDay
                                }
                                signaal{
                                    id
                                }
                            }
                        }
                    }''',
            },
            content_type='application/json'
        )

        print(f">> >> >> response {response.json} ")

        # assert
        assert rm1.call_count == 1
        assert rm2.call_count == 2
        assert rm3.call_count == 1
        assert rm4.call_count == 1
        assert rm5.call_count == 2
        assert rm6.call_count == 1
        assert rm7.call_count == 1
        assert fallback.called == 0
        assert response.json == {'data': {
            'evaluateAlarms': {
                'alarmTriggerResult': [{
                    'alarm': {
                        'isActive': False, 'startDate': '2021-12-06', 'datumMargin': 1,
                        'bedrag': '125.00', 'bedragMargin': '10.00', 'byDay': ['Wednesday', 'Friday']
                    },
                    'nextAlarm': {
                        'isActive': True, 'startDate': '2021-12-08', 'datumMargin': 1, 'bedrag': '125.00',
                        'bedragMargin': '10.00', 'byDay': ['Wednesday', 'Friday']
                    },
                    'signaal': None
                }]
            }
        }}


# Test if an alarm in the past gets disabled, still creates a next in sequence alarm, and creates a signal
@freeze_time("2021-12-13")
def test_evaluate_alarm_in_the_past(client):
    with requests_mock.Mocker() as rm:
        # arrange
        banktransactie = {
            "id": banktransactie_id,
            "bedrag": 12000,
            "customer_statement_message_id": 15,
            "information_to_account_owner": "NL83ABNA1927261899               Leefgeld ZOEKTERMPERSONA2 januari 2019",
            "is_credit": False,
            "is_geboekt": True,
            "statement_line": "190101D-1195.20NMSC028",
            "tegen_rekening": "NL83ABNA1927261899",
            "transactie_datum": "2021-12-01"
        }
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/?is_active=True", json={'data': [alarm]})
        rm2 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids={afspraak_id}", json={"data": [afspraak]})
        rm3 = rm.get(
            f"{settings.HHB_SERVICES_URL}/journaalposten/?filter_ids={journaalpost_id}",
            json={"data": [journaalpost]}
        )
        rm4 = rm.get(
            f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_ids={transaction_id}",
            json={"data": [banktransactie]}
        )
        rm5 = rm.post(f"{settings.ALARMENSERVICE_URL}/alarms/", status_code=201, json={"ok": True, "data": nextAlarm})
        rm6 = rm.post(f"{settings.SIGNALENSERVICE_URL}/signals/", status_code=201, json={"data": signaal})
        rm7 = rm.put(f"{settings.ALARMENSERVICE_URL}/alarms/{alarm_id}", json={"ok": True, "data": nextAlarm})
        rm8 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201)
        rm9 = rm.post(f"{settings.HHB_SERVICES_URL}/afspraken/{afspraak_id}")

        # act
        response = client.post(
            "/graphql",
            json={
                "query": '''
                    mutation test {
                        evaluateAlarms {
                            alarmTriggerResult {
                                alarm {
                                    isActive
                                    startDate
                                    datumMargin
                                    bedrag
                                    bedragMargin
                                    byDay
                                }
                                nextAlarm{
                                    isActive
                                    startDate
                                    datumMargin
                                    bedrag
                                    bedragMargin
                                    byDay
                                }
                                signaal{
                                    id
                                }
                            }
                        }
                    }''',
            },
            content_type='application/json'
        )

        print(f">> >> >> response {response.json} ")

        # assert
        assert rm1.call_count == 1
        assert rm2.call_count == 2
        assert rm3.call_count == 1
        assert rm4.call_count == 1
        assert rm5.call_count == 1
        assert rm6.call_count == 1
        assert rm7.call_count == 1
        assert rm8.call_count == 3
        assert rm9.call_count == 1
        assert fallback.called == 0
        assert response.json == {'data': {
            'evaluateAlarms': {
                'alarmTriggerResult': [{
                    'alarm': {
                        'isActive': False, 'startDate': '2021-12-06', 'datumMargin': 1, 'bedrag': '125.00',
                        'bedragMargin': '10.00', 'byDay': ['Wednesday', 'Friday']
                    },
                    'nextAlarm': {
                        'isActive': True, 'startDate': '2021-12-08', 'datumMargin': 1, 'bedrag': '125.00',
                        'bedragMargin': '10.00', 'byDay': ['Wednesday', 'Friday']
                    },
                    'signaal': {'id': 'e2b282d9-b31f-451e-9242-11f86c902b35'}
                }]
            }
        }}
