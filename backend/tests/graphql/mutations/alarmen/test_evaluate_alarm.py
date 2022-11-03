import pytest
import requests_mock
from datetime import date, datetime
from freezegun import freeze_time

import hhb_backend.graphql.mutations.alarmen.evaluate_alarm as EvaluateAlarm
from hhb_backend.graphql import settings
from hhb_backend.graphql.mutations.alarmen.alarm import generate_alarm_date
from hhb_backend.service.model.alarm import Alarm
from hhb_backend.service.model.bank_transaction import BankTransaction
from tests import post_echo_with_str_id
from tests.utils.mock_utils import mock_feature_flag

alarm_id = "00943958-8b93-4617-aa43-669a9016aad9"
afspraak_id = 19
journaalpost_id = 1
banktransactie_id = 100
alarm = Alarm(
    id=alarm_id,
    isActive=True,
    afspraakId=19,
    startDate="2021-12-06",
    datumMargin=1,
    bedrag=12000,
    bedragMargin=1000,
    byDay=["Wednesday", "Friday"],
    byMonth=[],
    byMonthDay=[]
)
alarm_inactive = Alarm(
    id=alarm_id,
    isActive=False,
    afspraakId=19,
    startDate="2021-12-06",
    datumMargin=1,
    bedrag=12000,
    bedragMargin=1000,
    byDay=["Wednesday", "Friday"],
    byMonth=[],
    byMonthDay=[]
)
nextAlarm = Alarm(
    id="33738845-7f23-4c8f-8424-2b560a944884",
    isActive=True,
    afspraakId=19,
    startDate="2021-12-08",
    datumMargin=1,
    bedrag=12000,
    bedragMargin=1000,
    byDay=["Wednesday", "Friday"],
    byMonth=[],
    byMonthDay=[]
)
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
    "transaction_id": banktransactie_id
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
        (datetime(2021, 12, 6), {"byDay": ["Monday"]}, (datetime(2021, 12, 1))),
        (datetime(2021, 12, 7), {"byDay": ["Tuesday"]}, (datetime(2021, 12, 1))),
        (datetime(2021, 12, 1), {"byDay": ["Wednesday"]}, (datetime(2021, 12, 1))),
        (datetime(2021, 12, 2), {"byDay": ["Thursday"]}, (datetime(2021, 12, 1))),
        (datetime(2021, 12, 3), {"byDay": ["Friday"]}, (datetime(2021, 12, 1))),
        (datetime(2021, 12, 4), {"byDay": ["Saturday"]}, (datetime(2021, 12, 1))),
        (datetime(2021, 12, 5), {"byDay": ["Sunday"]}, (datetime(2021, 12, 1))),
    ])
def test_generateNextAlarmDate_weekly(expected: datetime, alarm, alarmDate):
    next_alarm_date = generate_alarm_date(alarm, alarmDate)
    assert next_alarm_date == expected.date()


@freeze_time("2021-12-01")
@pytest.mark.parametrize(
    ["expected", "alarm", "alarmDate"], [
        (datetime(2022, 1, 1), {"byMonth": [1], "byMonthDay": [1]}, (datetime(2021, 12, 1))),
        (datetime(2022, 3, 10), {"byMonth": [3], "byMonthDay": [10, 15, 30]}, (datetime(2021, 12, 1))),
        (datetime(2021, 12, 1), {"byMonth": [12], "byMonthDay": [1]}, (datetime(2021, 12, 1))),
        (datetime(2022, 3, 1), {"byMonth": [3, 4, 5, 6, 7, 8, 9, 10], "byMonthDay": [1]}, (datetime(2021, 12, 1))),
        (datetime(2022, 11, 30), {"byMonth": [11], "byMonthDay": [30]}, (datetime(2021, 12, 1))),
        (datetime(2021, 12, 1), {"byMonth": [12], "byMonthDay": [1, 2, 3, 4, 5]}, (datetime(2021, 12, 1))),
    ])
def test_generateNextAlarmDate_monthly(expected: datetime, alarm, alarmDate: datetime):
    next_alarm_date = generate_alarm_date(alarm, alarmDate)
    assert next_alarm_date == expected.date()


@freeze_time("2021-12-01")
@pytest.mark.parametrize(
    ["expected", "alarm"],
    [
        (False, Alarm(isActive=True, startDate="2021-12-01", datumMargin=0)),
        (False, Alarm(isActive=True, startDate="2021-12-01", datumMargin=1)),
        (True, Alarm(isActive=True, startDate="2021-11-30", datumMargin=0)),
        (False, Alarm(isActive=True, startDate="2021-11-30", datumMargin=1)),
        (False, Alarm(isActive=True, startDate="2021-12-02", datumMargin=1)),
        (True, Alarm(isActive=True, startDate="2021-11-25", datumMargin=1))
    ]
)
def test_should_check_alarm(expected: bool, alarm: Alarm):
    actual = EvaluateAlarm.should_check_alarm(alarm)
    assert actual == expected


@pytest.mark.parametrize(
    ["expected_createSignal", "expected_difference", "deviated_ids", "alarm", "transacties"],
    [
        # 0. nominal case
        (False, '0.00', [],
         Alarm(startDate="2022-01-01", datumMargin=1, bedrag=10000, bedragMargin=1000),
         [BankTransaction(id=1, transactie_datum="2022-01-01", bedrag=10000)]),
        # 1. within date window, within monetary window, no signal
        (False, '10.00', [],
         Alarm(startDate="2022-01-01", datumMargin=1, bedrag=10000, bedragMargin=1000),
         [BankTransaction(id=1, transactie_datum="2022-01-01", bedrag=9000)]),
        # 2. within date window, outside monetary window, signal with transaction
        (True, '20.00', [1],
         Alarm(startDate="2022-01-01", datumMargin=1, bedrag=10000, bedragMargin=1000),
         [BankTransaction(id=1, transactie_datum="2022-01-01", bedrag=8000)]),
        # 3. within date window, outside monetary window, signal with transaction
        (True, '20.00', [1],
         Alarm(startDate="2022-01-01", datumMargin=1, bedrag=10000, bedragMargin=1000),
         [BankTransaction(id=1, transactie_datum="2022-01-01", bedrag=12000)]),
        # 4. within date window, multiple transactions that are together the right amount, no signal
        (False, '0.00', [],
         Alarm(startDate="2022-01-01", datumMargin=1, bedrag=10000, bedragMargin=1000),
         [BankTransaction(id=1, transactie_datum="2022-01-01", bedrag=3000),
          BankTransaction(id=2, transactie_datum="2022-01-01", bedrag=7000)]),
        # 5. within date window, multiple transactions that are together within monetary window, no signal
        (False, '10.00', [],
         Alarm(startDate="2022-01-01", datumMargin=1, bedrag=10000, bedragMargin=1000),
         [BankTransaction(id=1, transactie_datum="2022-01-01", bedrag=3000),
          BankTransaction(id=2, transactie_datum="2022-01-01", bedrag=6000)]),
        # 6. within date window, multiple transactions that are together outdside monetary window, signal with transactions
        (True, '20.00', [1, 2],
         Alarm(startDate="2022-01-01", datumMargin=1, bedrag=10000, bedragMargin=1000),
         [BankTransaction(id=1, transactie_datum="2022-01-01", bedrag=3000),
          BankTransaction(id=2, transactie_datum="2022-01-01", bedrag=5000)]),
        # 7. within date window, one transaction within and one outside monetary window, signal with the second transaction
        (True, '30.00', [2],
         Alarm(startDate="2022-01-01", datumMargin=1, bedrag=10000, bedragMargin=1000),
         [BankTransaction(id=1, transactie_datum="2022-01-01", bedrag=10000),
          BankTransaction(id=2, transactie_datum="2022-01-01", bedrag=3000)]),
        # 8. within date window, two transaction within monetary window, signal without transactions!
        (True, '100.00', [],
         Alarm(startDate="2022-01-01", datumMargin=1, bedrag=10000, bedragMargin=1000),
         [BankTransaction(id=1, transactie_datum="2022-01-01", bedrag=10000),
          BankTransaction(id=2, transactie_datum="2022-01-01", bedrag=10000)]),
        # 9. outside date window on date of evaluation, one transaction with right amount, signal without transaction!
        (True, '100.00', [],
         Alarm(startDate="2022-01-01", datumMargin=1, bedrag=10000, bedragMargin=1000),
         [BankTransaction(id=1, transactie_datum="2022-01-03", bedrag=10000)]),
        # 10. outside date window before the window, one transaction with right amount, signal without transaction!
        (True, '100.00', [],
         Alarm(startDate="2022-01-03", datumMargin=1, bedrag=10000, bedragMargin=1000),
         [BankTransaction(id=1, transactie_datum="2022-01-01", bedrag=10000)]),
        # 11. outside date window, no transactions
        (True, '100.00', [],
         Alarm(startDate="2022-01-01", datumMargin=1, bedrag=10000, bedragMargin=1000),
         []),
    ]
)
def test_bedrag_difference(expected_createSignal, expected_difference, deviated_ids, alarm: Alarm,
                           transacties: list[BankTransaction]):
    createSignal, difference, monetary_deviated_transaction_ids = EvaluateAlarm.get_bedrag_difference(alarm,
                                                                                                      transacties)
    assert expected_createSignal == createSignal
    assert expected_difference == difference
    assert deviated_ids == monetary_deviated_transaction_ids


def test_get_banktransactions_by_journaalposten():
    """This tests if the right banktransactions from the provided journaalposten are retrieved."""
    with requests_mock.Mocker() as rm:
        rm1 = rm.get(
            f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_ids={banktransactie_id}",
            json={"data": [banktransactie]}
        )
        transactions = EvaluateAlarm.get_banktransactions_by_journaalposten([journaalpost])
        assert rm1.call_count == 1
        assert transactions == [banktransactie]

def test_get_banktransactions_by_journaalposten_no_journaalposten():
    """This tests if an empty array is returned if no journaalposten are provided."""
    transactions = EvaluateAlarm.get_banktransactions_by_journaalposten([])
    assert transactions == []


@freeze_time("2021-12-08")
def test_disable_alarm():
    """This tests if an alarm gets disabled."""
    with requests_mock.Mocker() as rm:
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.put(f"{settings.ALARMENSERVICE_URL}/alarms/{alarm_id}", json=post_echo_with_str_id(alarm_id))
        alarm_response: Alarm = EvaluateAlarm.disable_alarm(date(2021, 12, 8), alarm)
        assert fallback.call_count == 0
        assert rm1.call_count == 1
        assert alarm_response.isActive == False

        # restore alarm
        alarm.isActive = True

@freeze_time("2021-12-06")
def test_disable_alarm_not_disabled():
    """This tests that when an alarm should not be disabled yet, it stays active."""
    alarm_response: Alarm = EvaluateAlarm.disable_alarm(date(2021, 12, 8), alarm)
    assert alarm_response.isActive == True


@freeze_time("2021-12-08")
def test_should_check_alarm_true():
    """This tests if the alarm should be evaluated, here it should."""
    need_check = EvaluateAlarm.should_check_alarm(alarm)
    assert need_check == True

@freeze_time("2021-12-06")
def test_should_check_alarm_false():
    """This tests if the alarm should be evaluated, here it should not."""
    need_check = EvaluateAlarm.should_check_alarm(alarm)
    assert need_check == False


@freeze_time("2021-12-08")
async def test_should_create_next_alarm_success():
    """This tests if the next alarm is created."""
    alarm_result = await EvaluateAlarm.should_create_next_alarm(alarm, date(2021, 12, 8), [alarm])
    assert alarm_result == nextAlarm

@freeze_time("2021-12-08")
async def test_should_create_next_alarm_already_exists():
    """This tests if the next alarm already exists, no new alarm is created."""
    alarm_result = await EvaluateAlarm.should_create_next_alarm(alarm, date(2021, 12, 8), [alarm, nextAlarm])
    assert alarm_result == None

@freeze_time("2021-12-06")
async def test_should_create_next_alarm_still_active():
    """This tests if the next alarm is not created, because the current one is still active."""
    alarm_result = await EvaluateAlarm.should_create_next_alarm(alarm, date(2021, 12, 8), [alarm])
    assert alarm_result == None

@freeze_time("2021-12-08")
async def test_should_create_next_alarm_end_date():
    """This tests if the next alarm is not created, since the current one has and end date before the next date."""
    alarm.endDate = "2021-12-08"
    alarm_result = await EvaluateAlarm.should_create_next_alarm(alarm, date(2021, 12, 8), [alarm])
    alarm.endDate = None
    assert alarm_result == None


# should_create_signaal()


# @freeze_time("2021-12-08")
# def test_evaluate_alarm_illegal_betaalinstructie_combination(client, mocker):
#     """This tests the evaluation of an alarm that has an invalid combination of byDay, byMonth and byMonthDay."""
#     with requests_mock.Mocker() as rm:
#         # arrange
#         alarm = {
#             "id": alarm_id,
#             "isActive": True,
#             "afspraakId": 19,
#             "startDate": "2021-12-06",
#             "datumMargin": 1,
#             "bedrag": 12500,
#             "bedragMargin": 1000,
#             "byDay": ["Wednesday", "Friday"],
#             "byMonth": [1],
#             "byMonthDay": [1],
#         }
#         expected = "This combination of intructions is not supported. isWeekly:False isMonthly:False byDay:['Wednesday', 'Friday'] byMonth:[1] byMonthDay:[1]"

#         fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
#         rm1 = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/", status_code=200, json={'data': [alarm]})
#         rm2 = rm.get(
#             f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids={afspraak_id}",
#             json={"data": [afspraak]}
#         )
#         rm3 = rm.get(
#             f"{settings.HHB_SERVICES_URL}/journaalposten/?filter_ids={journaalpost_id}",
#             json={"data": [journaalpost]}
#         )
#         rm4 = rm.get(
#             f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_ids={banktransactie_id}",
#             json={"data": [banktransactie]}
#         )
#         rm5 = rm.put(f"{settings.ALARMENSERVICE_URL}/alarms/{alarm_id}", json={"ok": True, "data": alarm_inactive})

#         # Mock feature flag "signalen" to be enabled
#         mocker.patch('hhb_backend.feature_flags.Unleash.is_enabled', mock_feature_flag("signalen", True))

#         # act
#         response = client.post(
#             "/graphql",
#             json={
#                 "query": '''
#                     mutation test {
#                         evaluateAlarms {
#                             alarmTriggerResult {
#                                 alarm {
#                                     id
#                                 }
#                                 nextAlarm{
#                                     id
#                                 }
#                                 signaal{
#                                     id
#                                 }
#                             }
#                         }
#                     }''',
#             },
#             content_type='application/json'
#         )

#         assert rm1.call_count == 1
#         assert rm2.call_count == 1
#         assert rm3.call_count == 1
#         assert rm4.call_count == 1
#         assert rm5.call_count == 1
#         assert fallback.call_count == 0
#         assert response.json.get("errors")[0].get("message") == expected


# @freeze_time("2021-12-08")
# def test_evaluate_alarm_inactive(client, mocker):
#     """This tests the evaluation of an alarm that is not active."""
#     with requests_mock.Mocker() as rm:
#         # arrange
#         fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
#         rm1 = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/?filter_active=true", json={'data': []})
#         rm2 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201)
#         expected = {'data': {'evaluateAlarms': {'alarmTriggerResult': []}}}

#         # Mock feature flag "signalen" to be enabled
#         mocker.patch('hhb_backend.feature_flags.Unleash.is_enabled', mock_feature_flag("signalen", True))

#         # act
#         response = client.post(
#             "/graphql",
#             json={
#                 "query": '''
#                     mutation test {
#                         evaluateAlarms {
#                             alarmTriggerResult {
#                                 alarm {
#                                     id
#                                 }
#                                 nextAlarm{
#                                     id
#                                 }
#                                 signaal{
#                                     id
#                                 }
#                             }
#                         }
#                     }''',
#             },
#             content_type='application/json'
#         )

#         # assert
#         assert rm1.call_count == 1
#         assert rm2.call_count == 1
#         assert fallback.call_count == 0
#         assert response.json == expected


# @freeze_time("2021-12-08")
# def test_evaluate_alarm_no_signal(client, mocker):
#     """This tests the evaluation of an alarm that should not result in a signaal"""
#     with requests_mock.Mocker() as rm:
#         # arrange
#         expected = {'data': {'evaluateAlarms': {'alarmTriggerResult': [
#             {'alarm': {'id': '00943958-8b93-4617-aa43-669a9016aad9'},
#              'nextAlarm': {'id': '33738845-7f23-4c8f-8424-2b560a944884'}, 'signaal': None}]}}}
#         fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
#         rm1 = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/?filter_active=true", json={'data': [alarm]})
#         rm2 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids={afspraak_id}", json={"data": [afspraak]})
#         rm3 = rm.get(
#             f"{settings.HHB_SERVICES_URL}/journaalposten/?filter_ids={journaalpost_id}",
#             json={"data": [journaalpost]}
#         )
#         rm4 = rm.get(
#             f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_ids={banktransactie_id}",
#             json={"data": [banktransactie]}
#         )
#         rm5 = rm.post(f"{settings.ALARMENSERVICE_URL}/alarms/", status_code=201, json={"ok": True, "data": nextAlarm})
#         rm6 = rm.post(f"{settings.HHB_SERVICES_URL}/afspraken/{afspraak_id}")
#         rm7 = rm.put(f"{settings.ALARMENSERVICE_URL}/alarms/{alarm_id}", json={"ok": True, "data": alarm_inactive})
#         rm8 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201)

#         # Mock feature flag "signalen" to be enabled
#         mocker.patch('hhb_backend.feature_flags.Unleash.is_enabled', mock_feature_flag("signalen", True))

#         # act
#         response = client.post(
#             "/graphql",
#             json={
#                 "query": '''
#                     mutation test {
#                         evaluateAlarms {
#                             alarmTriggerResult {
#                                 alarm {
#                                     id
#                                 }
#                                 nextAlarm{
#                                     id
#                                 }
#                                 signaal{
#                                     id
#                                 }
#                             }
#                         }
#                     }''',
#             },
#             content_type='application/json'
#         )

#         print(f">> >> >> response: {response.json} ")

#         # assert
#         assert rm1.call_count == 1
#         assert rm2.call_count == 2
#         assert rm3.call_count == 1
#         assert rm4.call_count == 1
#         assert rm5.call_count == 1
#         assert rm6.call_count == 1
#         assert rm7.call_count == 1
#         assert rm8.call_count == 1
#         assert fallback.call_count == 0
#         assert response.json == expected


# @freeze_time("2021-12-08")
# def test_evaluate_alarm_signal_date(client, mocker):
#     """Todo: what does this test do?"""
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
#             "transactie_datum": "2021-11-11"
#         }
#         fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
#         rm1 = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/?filter_active=true", json={'data': [alarm]})
#         rm2 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids={afspraak_id}", json={"data": [afspraak]})
#         rm3 = rm.get(
#             f"{settings.HHB_SERVICES_URL}/journaalposten/?filter_ids={journaalpost_id}",
#             json={"data": [journaalpost]}
#         )
#         rm4 = rm.get(
#             f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_ids={banktransactie_id}",
#             json={"data": [banktransactie]}
#         )
#         rm5 = rm.post(f"{settings.ALARMENSERVICE_URL}/alarms/", status_code=201, json={"ok": True, "data": nextAlarm})
#         rm6 = rm.post(f"{settings.SIGNALENSERVICE_URL}/signals/", status_code=201, json={"data": signaal})
#         rm7 = rm.put(f"{settings.ALARMENSERVICE_URL}/alarms/{alarm_id}", json={"ok": True, "data": alarm_inactive})
#         rm8 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201)
#         rm9 = rm.post(f"{settings.HHB_SERVICES_URL}/afspraken/{afspraak_id}")

#         # Mock feature flag "signalen" to be enabled
#         mocker.patch('hhb_backend.feature_flags.Unleash.is_enabled', mock_feature_flag("signalen", True))

#         # act
#         response = client.post(
#             "/graphql",
#             json={
#                 "query": '''
#                     mutation test {
#                         evaluateAlarms {
#                             alarmTriggerResult {
#                                 alarm {
#                                     id
#                                 }
#                                 nextAlarm{
#                                     id
#                                 }
#                                 signaal{
#                                     id
#                                 }
#                             }
#                         }
#                     }''',
#             },
#             content_type='application/json'
#         )

#         # assert
#         assert rm1.call_count == 1
#         assert rm2.call_count == 2
#         assert rm3.call_count == 1
#         assert rm4.call_count == 1
#         assert rm5.call_count == 1
#         assert rm6.call_count == 1
#         assert rm7.call_count == 2
#         assert rm8.call_count == 1
#         assert rm9.call_count == 1
#         assert fallback.call_count == 0
#         assert response.json == {'data': {
#             'evaluateAlarms': {
#                 'alarmTriggerResult': [{
#                     'alarm': {'id': '00943958-8b93-4617-aa43-669a9016aad9'},
#                     'nextAlarm': {'id': '33738845-7f23-4c8f-8424-2b560a944884'},
#                     'signaal': {'id': 'e2b282d9-b31f-451e-9242-11f86c902b35'}
#                 }]
#             }
#         }}


# @freeze_time("2021-12-08")
# def test_evaluate_multiple_alarms(client, mocker):
#     """This tests if evaluating multiple alarms works as expected."""
#     with requests_mock.Mocker() as rm:
#         # arrange
#         alarm1 = Alarm(
#             id="9b205557-4c6a-468e-94f8-ed4bad90bd3f",
#             isActive=True,
#             afspraakId=19,
#             startDate="2021-12-07",
#             datumMargin=0,
#             bedrag=8000,
#             bedragMargin=1000,
#             byDay=["Wednesday", "Friday"],
#             byMonth=[],
#             byMonthDay=[]
#         )
#         alarm1_inactive = Alarm(
#             id="9b205557-4c6a-468e-94f8-ed4bad90bd3f",
#             isActive=False,
#             afspraakId=19,
#             startDate="2021-12-07",
#             datumMargin=0,
#             bedrag=8000,
#             bedragMargin=1000,
#             byDay=["Wednesday", "Friday"],
#             byMonth=[],
#             byMonthDay=[]
#         )
#         signaal1 = {
#             "id": "e2b282d9-b31f-451e-9242-11f86c902b35",
#             "alarmId": alarm1.id,
#             "isActive": True,
#             "type": "default",
#             "actions": [],
#             "context": None,
#             "timeCreated": "2021-12-13T13:20:40.784Z"
#         }
#         fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
#         rm1 = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/?filter_active=true",
#                      json={'data': [alarm, alarm1, nextAlarm]})
#         rm2 = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/?filter_ids={alarm_id},{alarm1.id}",
#                      json={'data': [alarm, alarm1]})
#         rm3 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids={afspraak_id}", json={"data": [afspraak]})
#         rm4 = rm.get(
#             f"{settings.HHB_SERVICES_URL}/journaalposten/?filter_ids={journaalpost_id}",
#             json={"data": [journaalpost]}
#         )
#         rm5 = rm.get(
#             f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_ids={banktransactie_id}",
#             json={"data": [banktransactie]}
#         )
#         rm6 = rm.post(f"{settings.SIGNALENSERVICE_URL}/signals/", status_code=201, json={"data": signaal1})
#         rm7 = rm.put(f"{settings.ALARMENSERVICE_URL}/alarms/{alarm_id}", json={"ok": True, "data": alarm_inactive})
#         rm8 = rm.put(f"{settings.ALARMENSERVICE_URL}/alarms/{alarm1.id}", json={"ok": True, "data": alarm1_inactive})
#         rm9 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201)

#         # Mock feature flag "signalen" to be enabled
#         mocker.patch('hhb_backend.feature_flags.Unleash.is_enabled', mock_feature_flag("signalen", True))

#         # act
#         response = client.post(
#             "/graphql",
#             json={
#                 "query": '''
#                     mutation test($ids: [String]) {
#                         evaluateAlarms(ids: $ids) {
#                             alarmTriggerResult {
#                                 alarm {
#                                     id
#                                 }
#                                 nextAlarm{
#                                     id
#                                 }
#                                 signaal{
#                                     id
#                                 }
#                             }
#                         }
#                     }''', "variables": {"ids": [alarm_id, alarm1.id]}
#             },
#             content_type='application/json'
#         )

#         print(f">>> response: {response.json}")

#         # assert
#         assert rm1.call_count == 1
#         assert rm2.call_count == 1
#         assert rm3.call_count == 2  # one call per alarm
#         assert rm4.call_count == 2  # one call per alarm
#         assert rm5.call_count == 2  # one call per alarm
#         assert rm6.call_count == 1
#         assert rm7.call_count == 1
#         assert rm8.call_count == 2  # update to inactive, update with signal
#         assert rm9.call_count == 1  # evaluate alarms
#         assert fallback.call_count == 0
#         assert response.json == {'data': {
#             'evaluateAlarms': {
#                 'alarmTriggerResult': [{
#                     'alarm': {'id': '00943958-8b93-4617-aa43-669a9016aad9'},
#                     'nextAlarm': None,
#                     'signaal': None
#                 },
#                     {
#                         'alarm': {'id': "9b205557-4c6a-468e-94f8-ed4bad90bd3f"},
#                         'nextAlarm': None,
#                         'signaal': {'id': 'e2b282d9-b31f-451e-9242-11f86c902b35'}
#                     }]
#             }
#         }}


# @freeze_time("2021-12-08")
# def test_evaluate_multiple_alarms_one_inactive(client, mocker):
#     """This tests if evaluating multiple alarms including one that is not active works as expected."""
#     with requests_mock.Mocker() as rm:
#         # arrange
#         alarm1 = Alarm(
#             id="9b205557-4c6a-468e-94f8-ed4bad90bd3f",
#             isActive=False,
#             afspraakId=19,
#             startDate="2021-12-07",
#             datumMargin=0,
#             bedrag=8000,
#             bedragMargin=1000,
#             byDay=["Wednesday", "Friday"],
#             byMonth=[],
#             byMonthDay=[]
#         )
#         fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
#         rm1 = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/?filter_active=true", json={'data': [alarm, nextAlarm]})
#         rm2 = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/?filter_ids={alarm_id},{alarm1.id}",
#                      json={'data': [alarm, alarm1]})
#         rm3 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids={afspraak_id}", json={"data": [afspraak]})
#         rm4 = rm.get(
#             f"{settings.HHB_SERVICES_URL}/journaalposten/?filter_ids={journaalpost_id}",
#             json={"data": [journaalpost]}
#         )
#         rm5 = rm.get(
#             f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_ids={banktransactie_id}",
#             json={"data": [banktransactie]}
#         )
#         rm6 = rm.put(f"{settings.ALARMENSERVICE_URL}/alarms/{alarm_id}", json={"ok": True, "data": alarm_inactive})
#         rm7 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201)

#         # Mock feature flag "signalen" to be enabled
#         mocker.patch('hhb_backend.feature_flags.Unleash.is_enabled', mock_feature_flag("signalen", True))

#         # act
#         response = client.post(
#             "/graphql",
#             json={
#                 "query": '''
#                     mutation test($ids: [String]) {
#                         evaluateAlarms(ids: $ids) {
#                             alarmTriggerResult {
#                                 alarm {
#                                     id
#                                 }
#                                 nextAlarm{
#                                     id
#                                 }
#                                 signaal{
#                                     id
#                                 }
#                             }
#                         }
#                     }''', "variables": {"ids": [alarm_id, alarm1.id]}
#             },
#             content_type='application/json'
#         )

#         print(f">>> response: {response.json}")

#         # assert
#         assert rm1.call_count == 1
#         assert rm2.call_count == 1
#         assert rm3.call_count == 1  # one call per active alarm
#         assert rm4.call_count == 1  # one call per active alarm
#         assert rm5.call_count == 1  # one call per active alarm
#         assert rm6.call_count == 1
#         assert rm7.call_count == 1  # evaluate alarms
#         assert fallback.call_count == 0
#         assert response.json == {'data': {
#             'evaluateAlarms': {
#                 'alarmTriggerResult': [{
#                     'alarm': {'id': '00943958-8b93-4617-aa43-669a9016aad9'},
#                     'nextAlarm': None,
#                     'signaal': None
#                 }]
#             }
#         }}


# def test_evaluate_alarm_without_banktransactions_gives_signal(client, mocker):
#     """This tests if no transactions are found, a signal gets created."""
#     with requests_mock.Mocker() as rm:
#         # arrange
#         afspraak1 = {
#             "id": afspraak_id,
#             "omschrijving": "this is a test afspraak",
#             "valid_from": "2021-01-01",
#             "aantal_betalingen": None,
#             "afdeling_id": None,
#             "bedrag": 12000,
#             "betaalinstructie": {
#                 "by_day": ["Wednesday", "Friday"],
#                 "start_date": "2019-01-01"
#             },
#             "burger_id": 2,
#             "credit": False,
#             "journaalposten": []
#         }
#         fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
#         rm1 = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/?filter_active=true", json={'data': [alarm]})
#         rm2 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids={afspraak_id}", json={"data": [afspraak1]})
#         rm4 = rm.post(f"{settings.ALARMENSERVICE_URL}/alarms/", status_code=201, json={"ok": True, "data": nextAlarm})
#         rm5 = rm.post(f"{settings.SIGNALENSERVICE_URL}/signals/", status_code=201,
#                       json=post_echo_with_str_id(signaal["id"]))
#         rm6 = rm.put(f"{settings.ALARMENSERVICE_URL}/alarms/{alarm_id}", json={"ok": True, "data": alarm_inactive})
#         rm7 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201)
#         rm8 = rm.post(f"{settings.HHB_SERVICES_URL}/afspraken/{afspraak_id}")

#         # Mock feature flag "signalen" to be enabled
#         mocker.patch('hhb_backend.feature_flags.Unleash.is_enabled', mock_feature_flag("signalen", True))

#         # act
#         response = client.post(
#             "/graphql",
#             json={
#                 "query": '''
#                     mutation test {
#                         evaluateAlarms {
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
#                                     bedragDifference
#                                 }
#                             }
#                         }
#                     }''',
#             },
#             content_type='application/json'
#         )

#         print(f">>> response: {response.json}")

#         # assert
#         assert rm1.call_count == 1
#         assert rm2.call_count == 2
#         assert rm4.call_count == 1
#         assert rm5.call_count == 1
#         assert rm6.call_count == 2
#         assert rm7.call_count == 1
#         assert rm8.call_count == 1
#         assert fallback.call_count == 0
#         assert response.json == {'data': {
#             'evaluateAlarms': {
#                 'alarmTriggerResult': [{
#                     'alarm': {'id': '00943958-8b93-4617-aa43-669a9016aad9'},
#                     'nextAlarm': {'id': '33738845-7f23-4c8f-8424-2b560a944884'},
#                     'signaal': {
#                         'id': 'e2b282d9-b31f-451e-9242-11f86c902b35',
#                         'bankTransactions': None,
#                         'bedragDifference': "120.00"}
#                 }]
#             }
#         }}


# @freeze_time("2021-12-08")
# def test_evaluate_alarm_transaction_outside_date_window_gives_signal_without_transaction(client, mocker):
#     """This tests if when a transaction outside the date window was found, creates a signal without this transaction in it."""
#     with requests_mock.Mocker() as rm:
#         # arrange
#         banktransactie = {
#             "id": banktransactie_id,
#             "bedrag": 12000,
#             "customer_statement_message_id": 15,
#             "information_to_account_owner": "NL83ABNA1927261899               Leefgeld ZOEKTERMPERSONA2 januari 2019",
#             "is_credit": False,
#             "is_geboekt": True,
#             "statement_line": "190101D-1195.20NMSC028",
#             "tegen_rekening": "NL83ABNA1927261899",
#             "transactie_datum": "2021-12-04"
#         }
#         fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
#         rm1 = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/?filter_active=true", json={'data': [alarm]})
#         rm2 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids={afspraak_id}", json={"data": [afspraak]})
#         rm3 = rm.get(
#             f"{settings.HHB_SERVICES_URL}/journaalposten/?filter_ids={journaalpost_id}",
#             json={"data": [journaalpost]}
#         )
#         rm4 = rm.get(
#             f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_ids={banktransactie_id}",
#             json={"data": [banktransactie]}
#         )
#         rm5 = rm.post(f"{settings.ALARMENSERVICE_URL}/alarms/", status_code=201, json={"ok": True, "data": nextAlarm})
#         rm6 = rm.post(f"{settings.SIGNALENSERVICE_URL}/signals/", status_code=201,
#                       json=post_echo_with_str_id(signaal["id"]))
#         rm7 = rm.put(f"{settings.ALARMENSERVICE_URL}/alarms/{alarm_id}", json={"ok": True, "data": alarm_inactive})
#         rm8 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201)
#         rm9 = rm.post(f"{settings.HHB_SERVICES_URL}/afspraken/{afspraak_id}")

#         # Mock feature flag "signalen" to be enabled
#         mocker.patch('hhb_backend.feature_flags.Unleash.is_enabled', mock_feature_flag("signalen", True))

#         # act
#         response = client.post(
#             "/graphql",
#             json={
#                 "query": '''
#                     mutation test {
#                         evaluateAlarms {
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
#                                     bedragDifference
#                                 }
#                             }
#                         }
#                     }''',
#             },
#             content_type='application/json'
#         )

#         print(f">>> response: {response.json}")

#         # assert
#         assert rm1.call_count == 1
#         assert rm2.call_count == 2
#         assert rm3.call_count == 1
#         assert rm4.call_count == 1
#         assert rm5.call_count == 1
#         assert rm6.call_count == 1
#         assert rm7.call_count == 2
#         assert rm8.call_count == 1
#         assert rm9.call_count == 1
#         assert fallback.call_count == 0
#         assert response.json == {'data': {
#             'evaluateAlarms': {
#                 'alarmTriggerResult': [{
#                     'alarm': {'id': '00943958-8b93-4617-aa43-669a9016aad9'},
#                     'nextAlarm': {'id': '33738845-7f23-4c8f-8424-2b560a944884'},
#                     'signaal': {
#                         'id': 'e2b282d9-b31f-451e-9242-11f86c902b35',
#                         'bankTransactions': None,
#                         'bedragDifference': '120.00'
#                     }
#                 }]
#             }
#         }}


# @freeze_time("2021-12-08")
# def test_evaluate_alarm_signal_monetary(client, mocker):
#     """Todo: what does this test do?"""
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
#         fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
#         rm1 = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/?filter_active=true", json={'data': [alarm]})
#         rm2 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids={afspraak_id}", json={"data": [afspraak]})
#         rm3 = rm.get(
#             f"{settings.HHB_SERVICES_URL}/journaalposten/?filter_ids={journaalpost_id}",
#             json={"data": [journaalpost]}
#         )
#         rm4 = rm.get(
#             f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_ids={banktransactie_id}",
#             json={"data": [banktransactie]}
#         )
#         rm5 = rm.post(f"{settings.ALARMENSERVICE_URL}/alarms/", status_code=201, json={"ok": True, "data": nextAlarm})
#         rm6 = rm.post(f"{settings.SIGNALENSERVICE_URL}/signals/", status_code=201,
#                       json=post_echo_with_str_id(signaal["id"]))
#         rm7 = rm.put(f"{settings.ALARMENSERVICE_URL}/alarms/{alarm_id}", json={"ok": True, "data": alarm_inactive})
#         rm8 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201)
#         rm9 = rm.post(f"{settings.HHB_SERVICES_URL}/afspraken/{afspraak_id}")

#         # Mock feature flag "signalen" to be enabled
#         mocker.patch('hhb_backend.feature_flags.Unleash.is_enabled', mock_feature_flag("signalen", True))

#         # act
#         response = client.post(
#             "/graphql",
#             json={
#                 "query": '''
#                     mutation test {
#                         evaluateAlarms {
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
#                                     bedragDifference
#                                 }
#                             }
#                         }
#                     }''',
#             },
#             content_type='application/json'
#         )

#         # assert
#         assert rm1.call_count == 1
#         assert rm2.call_count == 2
#         assert rm3.call_count == 1
#         assert rm4.call_count == 2
#         assert rm5.call_count == 1
#         assert rm6.call_count == 1
#         assert rm7.call_count == 2
#         assert rm8.call_count == 1
#         assert rm9.call_count == 1
#         assert fallback.call_count == 0
#         assert response.json == {'data': {
#             'evaluateAlarms': {
#                 'alarmTriggerResult': [{
#                     'alarm': {'id': '00943958-8b93-4617-aa43-669a9016aad9'},
#                     'nextAlarm': {'id': '33738845-7f23-4c8f-8424-2b560a944884'},
#                     'signaal': {
#                         'id': 'e2b282d9-b31f-451e-9242-11f86c902b35',
#                         'bankTransactions': [{'id': banktransactie_id}],
#                         'bedragDifference': '30.00'}
#                 }]
#             }
#         }}


# @freeze_time("2021-12-08")
# def test_evaluate_alarm_signal_monetary_one_transaction(client, mocker):
#     """Todo: what does this test do?"""
#     with requests_mock.Mocker() as rm:
#         # arrange
#         banktransactie1 = {
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
#         newafspraak = afspraak
#         newafspraak["alarm_id"] = alarm_id
#         fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
#         rm1 = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/?filter_active=true", status_code=200,
#                      json={'data': [alarm]})
#         rm1a = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/?filter_ids={alarm_id}", status_code=200,
#                       json={'data': [alarm]})
#         rm2 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids={afspraak_id}", status_code=200,
#                      json={"data": [afspraak]})
#         rm3 = rm.get(f"{settings.HHB_SERVICES_URL}/journaalposten/?filter_ids={journaalpost_id}", status_code=200,
#                      json={"data": [journaalpost]})
#         rm4 = rm.get(f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_ids={banktransactie_id}",
#                      status_code=200, json={"data": [banktransactie1]})
#         rm5 = rm.post(f"{settings.ALARMENSERVICE_URL}/alarms/", status_code=201, json={"ok": True, "data": nextAlarm})
#         rm6 = rm.post(f"{settings.SIGNALENSERVICE_URL}/signals/", status_code=201,
#                       json=post_echo_with_str_id(signaal["id"]))
#         rm7 = rm.put(f"{settings.ALARMENSERVICE_URL}/alarms/{alarm_id}", status_code=200,
#                      json={"ok": True, "data": alarm_inactive})
#         rm2a = rm.post(f"{settings.HHB_SERVICES_URL}/afspraken/{afspraak_id}", status_code=200,
#                        json={"data": [newafspraak]})
#         rm8 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201)
#         expected = {'data': {
#             'evaluateAlarm': {
#                 'alarmTriggerResult': [{
#                     'alarm': {'id': '00943958-8b93-4617-aa43-669a9016aad9'},
#                     'nextAlarm': {'id': '33738845-7f23-4c8f-8424-2b560a944884'},
#                     'signaal': {
#                         'id': 'e2b282d9-b31f-451e-9242-11f86c902b35',
#                         'bankTransactions': [{'id': 100}],
#                         'bedragDifference': '30.00'
#                     }
#                 }]
#             }
#         }}

#         # Mock feature flag "signalen" to be enabled
#         mocker.patch('hhb_backend.feature_flags.Unleash.is_enabled', mock_feature_flag("signalen", True))

#         # act
#         response = client.post(
#             "/graphql",
#             json={
#                 "query": '''
#                     mutation test($id:String!) {
#                         evaluateAlarm(id:$id) {
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
#                                     bedragDifference
#                                 }
#                             }
#                         }
#                     }''', "variables": {"id": alarm_id}
#             },
#             content_type='application/json'
#         )

#         print(f">> >> >> response {response.json} ")

#         # assert
#         assert rm1.call_count == 1
#         assert rm1a.call_count == 1
#         assert rm2.call_count == 2
#         assert rm2a.call_count == 1
#         assert rm3.call_count == 1
#         assert rm4.call_count == 2
#         assert rm5.call_count == 1
#         assert rm6.call_count == 1
#         assert rm7.call_count == 2
#         assert rm8.call_count == 1
#         assert fallback.call_count == 0
#         assert response.json == expected


# @freeze_time("2021-12-08")
# def test_evaluate_alarm_no_signal_multiple_transactions(client, mocker):
#     """Todo: what does this test do?"""
#     with requests_mock.Mocker() as rm:
#         # arrange
#         banktransactie1 = {
#             "id": banktransactie_id,
#             "bedrag": 3000,
#             "customer_statement_message_id": 15,
#             "information_to_account_owner": "NL83ABNA1927261899               Leefgeld ZOEKTERMPERSONA2 januari 2019",
#             "is_credit": False,
#             "is_geboekt": True,
#             "statement_line": "190101D-1195.20NMSC028",
#             "tegen_rekening": "NL83ABNA1927261899",
#             "transactie_datum": "2021-12-05"
#         }
#         banktransactie2 = {
#             "id": banktransactie_id + 1,
#             "bedrag": 9000,
#             "customer_statement_message_id": 15,
#             "information_to_account_owner": "NL83ABNA1927261899               Leefgeld ZOEKTERMPERSONA2 januari 2019",
#             "is_credit": False,
#             "is_geboekt": True,
#             "statement_line": "190101D-1195.20NMSC028",
#             "tegen_rekening": "NL83ABNA1927261899",
#             "transactie_datum": "2021-12-05"
#         }
#         journaalpost1 = {
#             "afspraak_id": afspraak_id,
#             "grootboekrekening_id": "BEivKapProPok",
#             "id": journaalpost_id,
#             "is_automatisch_geboekt": True,
#             "transaction_id": banktransactie_id
#         }
#         journaalpost2 = {
#             "afspraak_id": afspraak_id,
#             "grootboekrekening_id": "BEivKapProPok",
#             "id": journaalpost_id + 1,
#             "is_automatisch_geboekt": True,
#             "transaction_id": banktransactie_id + 1
#         }
#         afspraak = {
#             "id": afspraak_id,
#             "omschrijving": "this is a test afspraak",
#             "valid_from": "2021-01-01",
#             "aantal_betalingen": None,
#             "afdeling_id": None,
#             "bedrag": 12000,
#             "betaalinstructie": {
#                 "by_day": ["Wednesday", "Friday"],
#                 "start_date": "2019-01-01"
#             },
#             "burger_id": 2,
#             "credit": False,
#             "journaalposten": [journaalpost_id, journaalpost_id + 1],
#             "alarm_id": alarm_id
#         }

#         fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
#         rm1 = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/?filter_active=true", status_code=200,
#                      json={'data': [alarm]})
#         rm1a = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/?filter_ids={alarm_id}", status_code=200,
#                       json={'data': [alarm]})
#         rm2 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids={afspraak_id}", status_code=200,
#                      json={"data": [afspraak]})
#         rm3 = rm.get(f"{settings.HHB_SERVICES_URL}/journaalposten/?filter_ids={journaalpost_id},{journaalpost_id + 1}",
#                      status_code=200, json={"data": [journaalpost1, journaalpost2]})
#         rm4 = rm.get(
#             f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_ids={banktransactie_id},{banktransactie_id + 1}",
#             status_code=200, json={"data": [banktransactie1, banktransactie2]})
#         rm5 = rm.post(f"{settings.ALARMENSERVICE_URL}/alarms/", status_code=201, json={"ok": True, "data": nextAlarm})
#         rm7 = rm.put(f"{settings.ALARMENSERVICE_URL}/alarms/{alarm_id}", status_code=200,
#                      json={"ok": True, "data": alarm_inactive})
#         rm8 = rm.post(f"{settings.HHB_SERVICES_URL}/afspraken/{afspraak_id}", status_code=200,
#                       json={"data": [afspraak]})
#         rm9 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201)
#         expected = {'data': {'evaluateAlarm': {'alarmTriggerResult': [
#             {'alarm': {'id': '00943958-8b93-4617-aa43-669a9016aad9'},
#              'nextAlarm': {'id': '33738845-7f23-4c8f-8424-2b560a944884'},
#              'signaal': None}]}}}

#         # Mock feature flag "signalen" to be enabled
#         mocker.patch('hhb_backend.feature_flags.Unleash.is_enabled', mock_feature_flag("signalen", True))

#         # act
#         response = client.post(
#             "/graphql",
#             json={
#                 "query": '''
#                     mutation test($id:String!) {
#                         evaluateAlarm(id:$id) {
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
#                     }''', "variables": {"id": alarm_id}
#             },
#             content_type='application/json'
#         )

#         print(f">> >> >> response {response.json} ")

#         # assert
#         assert rm1.call_count == 1
#         assert rm1a.call_count == 1
#         assert rm2.call_count == 2
#         assert rm3.call_count == 1
#         assert rm4.call_count == 1
#         assert rm5.call_count == 1
#         assert rm7.call_count == 1
#         assert rm8.call_count == 1
#         assert rm9.call_count == 1
#         assert fallback.call_count == 0
#         assert response.json == expected


# @freeze_time("2021-12-08")
# def test_evaluate_alarm_next_alarm_in_sequence_already_exists(client, mocker):
#     """This tests if alarm next in sequence already exists and that an alarm in the future does not create a next in sequence alarm yet."""
#     with requests_mock.Mocker() as rm:
#         # arrange
#         alarm = Alarm(
#             id=alarm_id,
#             isActive=True,
#             afspraakId=19,
#             startDate="2021-12-06",
#             datumMargin=1,
#             bedrag=12500,
#             bedragMargin=1000,
#             byDay=["Wednesday", "Friday"],
#             byMonth=[],
#             byMonthDay=[]
#         )
#         next_alarm = Alarm(
#             id="10943958-8b93-4617-aa43-669a9016aad9",
#             isActive=True,
#             afspraakId=19,
#             startDate="2021-12-08",
#             datumMargin=1,
#             bedrag=12500,
#             bedragMargin=1000,
#             byDay=["Wednesday", "Friday"],
#             byMonth=[],
#             byMonthDay=[]
#         )
#         alarm_inactive = Alarm(
#             id=alarm_id,
#             isActive=False,
#             afspraakId=19,
#             startDate="2021-12-06",
#             datumMargin=1,
#             bedrag=12500,
#             bedragMargin=1000,
#             byDay=["Wednesday", "Friday"],
#             byMonth=[],
#             byMonthDay=[]
#         )
#         banktransactie = {
#             "id": banktransactie_id,
#             "bedrag": 12000,
#             "customer_statement_message_id": 15,
#             "information_to_account_owner": "NL83ABNA1927261899               Leefgeld ZOEKTERMPERSONA2 januari 2019",
#             "is_credit": False,
#             "is_geboekt": True,
#             "statement_line": "190101D-1195.20NMSC028",
#             "tegen_rekening": "NL83ABNA1927261899",
#             "transactie_datum": "2021-12-05"
#         }
#         fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
#         rm1 = rm.get(
#             f"{settings.ALARMENSERVICE_URL}/alarms/?filter_active=true", status_code=200,
#             json={'data': [alarm, next_alarm]}
#         )
#         rm2 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids={afspraak_id}", json={"data": [afspraak]})
#         rm3 = rm.get(
#             f"{settings.HHB_SERVICES_URL}/journaalposten/?filter_ids={journaalpost_id}",
#             json={"data": [journaalpost]}
#         )
#         rm4 = rm.get(
#             f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_ids={banktransactie_id}",
#             json={"data": [banktransactie]}
#         )
#         rm5 = rm.put(f"{settings.ALARMENSERVICE_URL}/alarms/{alarm_id}", status_code=200,
#                      json={"ok": True, "data": alarm_inactive})
#         rm6 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201)

#         # Mock feature flag "signalen" to be enabled
#         mocker.patch('hhb_backend.feature_flags.Unleash.is_enabled', mock_feature_flag("signalen", True))

#         # act
#         response = client.post(
#             "/graphql",
#             json={
#                 "query": '''
#                     mutation test {
#                         evaluateAlarms {
#                             alarmTriggerResult {
#                                 alarm {
#                                     id
#                                 }
#                                 nextAlarm{
#                                     id
#                                 }
#                                 signaal{
#                                     id
#                                 }
#                             }
#                         }
#                     }''',
#             },
#             content_type='application/json'
#         )

#         print(f">> >> >> response: {response.json} ")

#         # assert
#         assert rm1.call_count == 1
#         assert rm2.call_count == 2
#         assert rm3.call_count == 2
#         assert rm4.call_count == 2
#         assert rm5.call_count == 1
#         assert rm6.call_count == 1
#         assert fallback.call_count == 0
#         assert response.json == {'data': {
#             'evaluateAlarms': {
#                 'alarmTriggerResult': [
#                     {
#                         'alarm': {'id': '00943958-8b93-4617-aa43-669a9016aad9'},
#                         'nextAlarm': None,
#                         'signaal': None
#                     },
#                     {
#                         'alarm': {'id': '10943958-8b93-4617-aa43-669a9016aad9'},
#                         'nextAlarm': None,
#                         'signaal': None
#                     }
#                 ]
#             }
#         }}


# @freeze_time("2021-12-13")
# def test_evaluate_alarm_disabled_because_its_in_the_past(client, mocker):
#     """This tests if an alarm in the past gets disabled and still creates a next in sequence alarm."""
#     with requests_mock.Mocker() as rm:
#         # arrange
#         fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
#         rm1 = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/?filter_active=true", json={'data': [alarm]})
#         rm2 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids={afspraak_id}", json={"data": [afspraak]})
#         rm3 = rm.get(
#             f"{settings.HHB_SERVICES_URL}/journaalposten/?filter_ids={journaalpost_id}",
#             json={"data": [journaalpost]}
#         )
#         rm4 = rm.get(
#             f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_ids={banktransactie_id}",
#             json={"data": [banktransactie]}
#         )
#         rm5 = rm.post(f"{settings.ALARMENSERVICE_URL}/alarms/", status_code=201, json={"ok": True, "data": nextAlarm})
#         rm6 = rm.put(f"{settings.ALARMENSERVICE_URL}/alarms/{alarm_id}", status_code=200,
#                      json={"ok": True, "data": alarm_inactive})
#         rm7 = rm.post(f"{settings.HHB_SERVICES_URL}/afspraken/{afspraak_id}")
#         rm8 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201)

#         # Mock feature flag "signalen" to be enabled
#         mocker.patch('hhb_backend.feature_flags.Unleash.is_enabled', mock_feature_flag("signalen", True))

#         # act
#         response = client.post(
#             "/graphql",
#             json={
#                 "query": '''
#                     mutation test {
#                         evaluateAlarms {
#                             alarmTriggerResult {
#                                 alarm {
#                                     isActive
#                                     startDate
#                                     datumMargin
#                                     bedrag
#                                     bedragMargin
#                                     byDay
#                                 }
#                                 nextAlarm{
#                                     isActive
#                                     startDate
#                                     datumMargin
#                                     bedrag
#                                     bedragMargin
#                                     byDay
#                                 }
#                                 signaal{
#                                     id
#                                 }
#                             }
#                         }
#                     }''',
#             },
#             content_type='application/json'
#         )

#         print(f">> >> >> response {response.json} ")

#         # assert
#         assert rm1.call_count == 1
#         assert rm2.call_count == 2
#         assert rm3.call_count == 1
#         assert rm4.call_count == 1
#         assert rm5.call_count == 1
#         assert rm6.call_count == 1
#         assert rm7.call_count == 1
#         assert rm8.call_count == 1
#         assert fallback.call_count == 0
#         assert response.json == {'data': {
#             'evaluateAlarms': {
#                 'alarmTriggerResult': [{
#                     'alarm': {
#                         'isActive': False, 'startDate': '2021-12-06', 'datumMargin': 1,
#                         'bedrag': '120.00', 'bedragMargin': '10.00', 'byDay': ['Wednesday', 'Friday']
#                     },
#                     'nextAlarm': {
#                         'isActive': True, 'startDate': '2021-12-08', 'datumMargin': 1, 'bedrag': '120.00',
#                         'bedragMargin': '10.00', 'byDay': ['Wednesday', 'Friday']
#                     },
#                     'signaal': None
#                 }]
#             }
#         }}


# @freeze_time("2021-12-13")
# def test_evaluate_alarm_in_the_past(client, mocker):
#     """This tests if an alarm in the past gets disabled, still creates a next in sequence alarm, and creates a signal."""
#     with requests_mock.Mocker() as rm:
#         # arrange
#         banktransactie = {
#             "id": banktransactie_id,
#             "bedrag": 12000,
#             "customer_statement_message_id": 15,
#             "information_to_account_owner": "NL83ABNA1927261899               Leefgeld ZOEKTERMPERSONA2 januari 2019",
#             "is_credit": False,
#             "is_geboekt": True,
#             "statement_line": "190101D-1195.20NMSC028",
#             "tegen_rekening": "NL83ABNA1927261899",
#             "transactie_datum": "2021-12-01"
#         }
#         fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
#         rm1 = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/?filter_active=true", json={'data': [alarm]})
#         rm2 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids={afspraak_id}", json={"data": [afspraak]})
#         rm3 = rm.get(
#             f"{settings.HHB_SERVICES_URL}/journaalposten/?filter_ids={journaalpost_id}",
#             json={"data": [journaalpost]}
#         )
#         rm4 = rm.get(
#             f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_ids={banktransactie_id}",
#             json={"data": [banktransactie]}
#         )
#         rm5 = rm.post(f"{settings.ALARMENSERVICE_URL}/alarms/", status_code=201, json={"ok": True, "data": nextAlarm})
#         rm6 = rm.post(f"{settings.SIGNALENSERVICE_URL}/signals/", status_code=201, json={"data": signaal})
#         rm7 = rm.put(f"{settings.ALARMENSERVICE_URL}/alarms/{alarm_id}", json={"ok": True, "data": nextAlarm})
#         rm8 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201)
#         rm9 = rm.post(f"{settings.HHB_SERVICES_URL}/afspraken/{afspraak_id}")

#         # Mock feature flag "signalen" to be enabled
#         mocker.patch('hhb_backend.feature_flags.Unleash.is_enabled', mock_feature_flag("signalen", True))

#         # act
#         response = client.post(
#             "/graphql",
#             json={
#                 "query": '''
#                     mutation test {
#                         evaluateAlarms {
#                             alarmTriggerResult {
#                                 alarm {
#                                     isActive
#                                     startDate
#                                     datumMargin
#                                     bedrag
#                                     bedragMargin
#                                     byDay
#                                 }
#                                 nextAlarm{
#                                     isActive
#                                     startDate
#                                     datumMargin
#                                     bedrag
#                                     bedragMargin
#                                     byDay
#                                 }
#                                 signaal{
#                                     id
#                                 }
#                             }
#                         }
#                     }''',
#             },
#             content_type='application/json'
#         )

#         print(f">> >> >> response {response.json} ")

#         # assert
#         assert rm1.call_count == 1
#         assert rm2.call_count == 2
#         assert rm3.call_count == 1
#         assert rm4.call_count == 1
#         assert rm5.call_count == 1
#         assert rm6.call_count == 1
#         assert rm7.call_count == 2
#         assert rm8.call_count == 1
#         assert rm9.call_count == 1
#         assert fallback.call_count == 0
#         assert response.json == {'data': {
#             'evaluateAlarms': {
#                 'alarmTriggerResult': [{
#                     'alarm': {
#                         'isActive': False, 'startDate': '2021-12-06', 'datumMargin': 1, 'bedrag': '120.00',
#                         'bedragMargin': '10.00', 'byDay': ['Wednesday', 'Friday']
#                     },
#                     'nextAlarm': {
#                         'isActive': True, 'startDate': '2021-12-08', 'datumMargin': 1, 'bedrag': '120.00',
#                         'bedragMargin': '10.00', 'byDay': ['Wednesday', 'Friday']
#                     },
#                     'signaal': {'id': 'e2b282d9-b31f-451e-9242-11f86c902b35'}
#                 }]
#             }
#         }}
