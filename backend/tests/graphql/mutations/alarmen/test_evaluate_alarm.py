import pytest
import requests_mock
from datetime import date, datetime
from freezegun import freeze_time
from graphql import GraphQLError

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
    afspraakId=afspraak_id,
    startDate="2021-12-06",
    endDate=None,
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
    afspraakId=afspraak_id,
    startDate="2021-12-06",
    endDate=None,
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
    afspraakId=afspraak_id,
    startDate="2021-12-08",
    endDate=None,
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
    "alarm_id": nextAlarm.id,
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
banktransactie = BankTransaction(
    id=banktransactie_id,
    bedrag=12000,
    customer_statement_message_id=15,
    information_to_account_owner="NL83ABNA1927261899               Leefgeld ZOEKTERMPERSONA2 januari 2019",
    is_credit=False,
    is_geboekt=True,
    statement_line="190101D-1195.20NMSC028",
    tegen_rekening="NL83ABNA1927261899",
    transactie_datum="2021-12-06"
)
signal_id = "e2b282d9-b31f-451e-9242-11f86c902b35"
signaal = {
    "id": signal_id,
    "alarmId": alarm_id,
    "banktransactieIds": [],
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

def test_generateNextAlarmDate_illegal_combination():
    """This tests that an illegal combination of byDay, byMonth, and byMonthDay 
       is caught and a GraphQLError is thrown with the right message."""
    illegal_alarm = {"byDay": ["Monday"], "byMonth": [1], "byMonthDay": [1]}
    alarm_date = date(2021, 12, 1)
    try:
        generate_alarm_date(illegal_alarm, alarm_date)
    except GraphQLError as e:
        assert e.message == f"This combination of intructions is not supported. isWeekly:False isMonthly:False byDay:['Monday'] byMonth:[1] byMonthDay:[1]"



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
        get_banktransactions = rm.get(
            f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_ids={banktransactie_id}",
            json={"data": [banktransactie]}
        )
        transactions = EvaluateAlarm.get_banktransactions_by_journaalposten([journaalpost])
        assert get_banktransactions.call_count == 1
        assert transactions == [banktransactie]

def test_get_banktransactions_by_journaalposten_no_journaalposten():
    """This tests if an empty array is returned if no journaalposten are provided."""
    transactions = EvaluateAlarm.get_banktransactions_by_journaalposten([])
    assert transactions == []


@freeze_time("2021-12-08")
def test_disable_alarm_success():
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
def test_disable_alarm_not_disabled_when_alarm_check_date_in_future():
    """This tests that when an alarm should not be disabled yet, it stays active."""
    alarm_response: Alarm = EvaluateAlarm.disable_alarm(date(2021, 12, 8), alarm)
    assert alarm_response.isActive == True


@freeze_time("2021-12-08")
def test_should_check_alarm_true():
    """This tests if the alarm should be evaluated, here it should, since the check date is today."""
    need_check = EvaluateAlarm.should_check_alarm(alarm)
    assert need_check == True

@freeze_time("2021-12-06")
def test_should_check_alarm_false():
    """This tests if the alarm should be evaluated, here it should not, since the check date is in the future."""
    need_check = EvaluateAlarm.should_check_alarm(alarm)
    assert need_check == False


@freeze_time("2021-12-08")
def test_should_create_next_alarm_success(mocker):
    """This tests if the next alarm is created successfully."""
    with requests_mock.Mocker() as rm:
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        get_afspraak = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids={afspraak_id}", json={"data": [afspraak]})
        post_afspraak = rm.post(f"{settings.HHB_SERVICES_URL}/afspraken/{afspraak_id}", json={"data":afspraak}, status_code=200)
        post_alarm = rm.post(f"{settings.ALARMENSERVICE_URL}/alarms/", json={"data": nextAlarm}, status_code=201)
        
        # Mock feature flag "signalen" to be enabled
        mocker.patch('hhb_backend.feature_flags.Unleash.is_enabled', mock_feature_flag("signalen", True))

        alarm_result = EvaluateAlarm.should_create_next_alarm(alarm, date(2021, 12, 8), [alarm])

        assert fallback.call_count == 0
        assert get_afspraak.call_count == 1
        assert post_afspraak.call_count == 1
        assert post_alarm.call_count == 1
        assert alarm_result == nextAlarm

@freeze_time("2021-12-08")
def test_should_create_next_alarm_no_alarm_created_because_already_exists():
    """This tests when the next alarm already exists, no new alarm is created."""
    alarm_result = EvaluateAlarm.should_create_next_alarm(alarm, date(2021, 12, 8), [alarm, nextAlarm])
    assert alarm_result == None

@freeze_time("2021-12-08")
def test_should_create_next_alarm_no_alarm_created_because_end_date_before_next_alarm():
    """This tests that the next alarm is not created, since the current one has an end date before the next alarm date."""
    with requests_mock.Mocker() as rm:
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        get_afspraak = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids={afspraak_id}", json={"data": [afspraak]})
        
        alarm.endDate = "2021-12-07"
        alarm_result = EvaluateAlarm.should_create_next_alarm(alarm, date(2021, 12, 8), [alarm])
        alarm.endDate = None

        fallback.call_count == 0
        get_afspraak.call_count == 1
        assert alarm_result == None


@freeze_time("2021-12-06")
def test_should_create_signaal_no_signal_everything_is_alright():
    """This tests if no signal is created with a banktransaction 
       on the date of the alarm with the right amount."""
    signaal = EvaluateAlarm.should_create_signaal(alarm, [banktransactie])
    assert signaal == None

def test_should_create_signaal_monetary_signal(mocker):
    """This tests if a signal is created with a banktransaction 
       on the date of the alarm with an amount outside window."""
    with requests_mock.Mocker() as rm:
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        post_signal = rm.post(f"{settings.SIGNALENSERVICE_URL}/signals/", json=post_echo_with_str_id(signal_id), status_code=201)
        update_alarm = rm.put(f"{settings.ALARMENSERVICE_URL}/alarms/{alarm_id}", json=post_echo_with_str_id(alarm_id))
        banktransactie.bedrag = 8000

        # Mock feature flag "signalen" to be enabled
        mocker.patch('hhb_backend.feature_flags.Unleash.is_enabled', mock_feature_flag("signalen", True))

        signaal = EvaluateAlarm.should_create_signaal(alarm, [banktransactie])

        assert fallback.call_count == 0
        assert post_signal.call_count == 1
        assert update_alarm.call_count == 1

        assert signaal != None
        assert signaal.alarmId == alarm_id
        assert signaal.banktransactieIds == [banktransactie_id]
        assert signaal.bedragDifference == "40.00"
        assert alarm.signaalId == signaal.id

        # restore banktransactie and alarm
        banktransactie.bedrag = 12000
        alarm.signaalId = None

def test_should_create_signaal_no_banktransactie(mocker):
    """This tests if a signal is created when there is no banktransaction."""
    with requests_mock.Mocker() as rm:
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        post_signal = rm.post(f"{settings.SIGNALENSERVICE_URL}/signals/", json=post_echo_with_str_id(signal_id), status_code=201)
        update_alarm = rm.put(f"{settings.ALARMENSERVICE_URL}/alarms/{alarm_id}", json=post_echo_with_str_id(alarm_id))

        # Mock feature flag "signalen" to be enabled
        mocker.patch('hhb_backend.feature_flags.Unleash.is_enabled', mock_feature_flag("signalen", True))

        signaal = EvaluateAlarm.should_create_signaal(alarm, [])

        assert fallback.call_count == 0
        assert post_signal.call_count == 1
        assert update_alarm.call_count == 1

        assert signaal != None
        assert signaal.alarmId == alarm_id
        assert signaal.banktransactieIds == []
        assert signaal.bedragDifference == "120.00"
        assert alarm.signaalId == signaal.id

        #restore alarm
        alarm.signaalId = None

def test_evaluate_alarms_no_active_alarms(mocker):
    """Tests if there are no triggered alarms when there are no active alarms.
       Test 1 is for evaluate_alarms()
       Test 2 is for evaluate_one_alarm()"""
    with requests_mock.Mocker() as rm:
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        get_alarm = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/", json={"data": [alarm_inactive]})
        get_active_alarms = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/?filter_active=true", json={"data": []})
        
        # Mock feature flag "signalen" to be enabled
        mocker.patch('hhb_backend.feature_flags.Unleash.is_enabled', mock_feature_flag("signalen", True))

        # Test 1
        triggered_alarms = EvaluateAlarm.evaluate_alarms([alarm_id])

        assert fallback.call_count == 0
        assert get_alarm.call_count == 1
        assert get_active_alarms.call_count == 1
        assert triggered_alarms == []

        # Test 2
        triggered_alarms = EvaluateAlarm.evaluate_one_alarm(alarm_id)

        assert fallback.call_count == 0             # still zero
        assert get_alarm.call_count == 2            # +1 on previous call count
        assert get_active_alarms.call_count == 2    # +1 on previous call count
        assert triggered_alarms == []               # still empty list

@freeze_time("2021-12-08")
def test_evaluate_alarms_one_active_alarm(mocker):
    """Tests if there is one triggered alarm, that created an new alarm and a signal 
    when there is one active alarm and no journaalposten.
    Test 1 is for evaluate_alarms()
    Test 2 is for evaluate_one_alarm()"""
    with requests_mock.Mocker() as rm:
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        get_alarm = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/", json={"data": [alarm]})
        get_active_alarms = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/?filter_active=true", json={"data": [alarm]})
        post_alarm = rm.post(f"{settings.ALARMENSERVICE_URL}/alarms/", json=post_echo_with_str_id(nextAlarm.id), status_code=201)
        post_signal = rm.post(f"{settings.SIGNALENSERVICE_URL}/signals/", json=post_echo_with_str_id(signal_id), status_code=201)
        update_alarm = rm.put(f"{settings.ALARMENSERVICE_URL}/alarms/{alarm_id}", json=post_echo_with_str_id(alarm_id))
        get_afspraak = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids={afspraak_id}", json={"data": [afspraak]})
        post_afspraak = rm.post(f"{settings.HHB_SERVICES_URL}/afspraken/{afspraak_id}", json={"data":afspraak}, status_code=200)
        
        # Mock feature flag "signalen" to be enabled
        mocker.patch('hhb_backend.feature_flags.Unleash.is_enabled', mock_feature_flag("signalen", True))

        # Test 1
        triggered_alarms = EvaluateAlarm.evaluate_alarms([alarm_id])

        expected_signal = {
            "id": signal_id,
            "alarmId": alarm_id,
            "banktransactieIds": [],
            "isActive": True,
            "type": "default",
            "bedragDifference": '120.00'
        }
        alarm_inactive["signaalId"] = signal_id
        expected = [{
            "alarm": alarm_inactive, 
            "nextAlarm": nextAlarm, 
            "signaal": expected_signal
        }]

        assert fallback.call_count == 0
        assert get_alarm.call_count == 1
        assert get_active_alarms.call_count == 1
        assert post_alarm.call_count == 1
        assert post_signal.call_count == 1
        assert update_alarm.call_count == 2
        assert get_afspraak.call_count == 1
        assert post_afspraak.call_count == 1
        assert triggered_alarms == expected

        # Test 2
        triggered_alarms = EvaluateAlarm.evaluate_one_alarm(alarm_id)

        assert fallback.call_count == 0             # still zero
        # the rest # *2 on previous call count
        assert get_alarm.call_count == 2
        assert get_active_alarms.call_count == 2
        assert post_alarm.call_count == 2
        assert post_signal.call_count == 2
        assert update_alarm.call_count == 4
        assert get_afspraak.call_count == 2
        assert post_afspraak.call_count == 2
        assert triggered_alarms == expected

        # restore alarm_inactive
        alarm_inactive["signaalId"] = None

@freeze_time("2021-12-08")
def test_evaluate_alarms_multiple_alarms(mocker):
    """Tests if there is two triggered alarm, that created one new alarm and two signals 
    when there is two active alarm and no journaalposten."""
    with requests_mock.Mocker() as rm:
        alarm2 = Alarm(
            id=alarm_id,
            isActive=True,
            afspraakId=afspraak_id,
            startDate="2021-12-06",
            endDate="2021-12-07",
            datumMargin=1,
            bedrag=12000,
            bedragMargin=1000,
            byDay=["Wednesday", "Friday"],
            byMonth=[],
            byMonthDay=[]
        )
        expected_signal = {
            "id": signal_id,
            "alarmId": alarm_id,
            "banktransactieIds": [],
            "isActive": True,
            "type": "default",
            "bedragDifference": '120.00'
        }

        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        get_alarms = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/", json={"data": [alarm, alarm2]})
        get_active_alarms = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/?filter_active=true", json={"data": [alarm, alarm2]})
        post_alarm = rm.post(f"{settings.ALARMENSERVICE_URL}/alarms/", json=post_echo_with_str_id(nextAlarm.id), status_code=201)
        post_signal = rm.post(f"{settings.SIGNALENSERVICE_URL}/signals/", json=post_echo_with_str_id(signal_id), status_code=201)
        update_alarm = rm.put(f"{settings.ALARMENSERVICE_URL}/alarms/{alarm_id}", json=post_echo_with_str_id(alarm_id))
        get_afspraak = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids={afspraak_id}", json={"data": [afspraak]})
        post_afspraak = rm.post(f"{settings.HHB_SERVICES_URL}/afspraken/{afspraak_id}", json={"data":afspraak}, status_code=200)
        
        # Mock feature flag "signalen" to be enabled
        mocker.patch('hhb_backend.feature_flags.Unleash.is_enabled', mock_feature_flag("signalen", True))

        # Test 1
        triggered_alarms = EvaluateAlarm.evaluate_alarms([alarm_id])

        alarm_inactive["signaalId"] = signal_id
        alarm2["signaalId"] = signal_id
        alarm2["isActive"] = False
        expected = [{
            "alarm": alarm_inactive, 
            "nextAlarm": nextAlarm, 
            "signaal": expected_signal
        },
        {
            "alarm": alarm2, 
            "nextAlarm": None, 
            "signaal": expected_signal
        }]

        assert fallback.call_count == 0
        assert get_alarms.call_count == 1
        assert get_active_alarms.call_count == 1
        assert post_alarm.call_count == 1
        assert post_signal.call_count == 2
        assert update_alarm.call_count == 4
        assert get_afspraak.call_count == 1
        assert post_afspraak.call_count == 1
        assert triggered_alarms == expected
        
        # restore alarm_inactive
        alarm_inactive["signaalId"] = None

@freeze_time("2021-12-08")
def test_evaluate_alarms_one_alarm_no_signal_everything_alright(mocker):
    """Tests if there is one triggered alarm, that created an new alarm but no signal 
    when there is one active alarm and one journaalpost.
    Test 1 is for evaluate_alarms()
    Test 2 is for evaluate_one_alarm()"""
    with requests_mock.Mocker() as rm:
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        get_alarm = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/", json={"data": [alarm]})
        get_active_alarms = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/?filter_active=true", json={"data": [alarm]})
        post_alarm = rm.post(f"{settings.ALARMENSERVICE_URL}/alarms/", json=post_echo_with_str_id(nextAlarm.id), status_code=201)
        update_alarm = rm.put(f"{settings.ALARMENSERVICE_URL}/alarms/{alarm_id}", json=post_echo_with_str_id(alarm_id))
        get_afspraak = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids={afspraak_id}", json={"data": [afspraak]})
        post_afspraak = rm.post(f"{settings.HHB_SERVICES_URL}/afspraken/{afspraak_id}", json={"data":afspraak}, status_code=200)
        get_banktransactie = rm.get(f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_ids={banktransactie_id}", json={"data": [banktransactie]})
        
        # Mock feature flag "signalen" to be enabled
        mocker.patch('hhb_backend.feature_flags.Unleash.is_enabled', mock_feature_flag("signalen", True))

        # Test 1
        triggered_alarms = EvaluateAlarm.evaluate_alarms([alarm_id], [journaalpost])

        expected = [{
            "alarm": alarm_inactive, 
            "nextAlarm": nextAlarm, 
            "signaal": None
        }]

        assert fallback.call_count == 0
        assert get_alarm.call_count == 1
        assert get_active_alarms.call_count == 1
        assert post_alarm.call_count == 1
        assert update_alarm.call_count == 1
        assert get_afspraak.call_count == 1
        assert post_afspraak.call_count == 1
        assert get_banktransactie.call_count == 1
        assert triggered_alarms == expected

        # Test 2
        triggered_alarms = EvaluateAlarm.evaluate_one_alarm(alarm_id, journaalpost)

        assert fallback.call_count == 0             # still zero
        # the rest # *2 on previous call count
        assert get_alarm.call_count == 2
        assert get_active_alarms.call_count == 2
        assert post_alarm.call_count == 2
        assert update_alarm.call_count == 2
        assert get_afspraak.call_count == 2
        assert post_afspraak.call_count == 2
        assert get_banktransactie.call_count == 2
        assert triggered_alarms == expected

        # restore alarm_inactive
        alarm_inactive["signaalId"] = None


@freeze_time("2021-12-08")
def test_evaluate_alarms_via_schema(client, mocker):
    """This tests the evaluation of alarms via the schema, it should create a new alarm and a signal.
    The schema does not look for journaalposten, so this is an evaluation for alarms that did not get a 
    journaalpost/banktransactie during the day."""
    with requests_mock.Mocker() as rm:
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        get_active_alarms = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/?filter_active=true", json={'data': [alarm]})
        get_afspraken = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids={afspraak_id}", json={"data": [afspraak]})
        post_alarm = rm.post(f"{settings.ALARMENSERVICE_URL}/alarms/", status_code=201, json={"ok": True, "data": nextAlarm})
        post_signal = rm.post(f"{settings.SIGNALENSERVICE_URL}/signals/", status_code=201,
                      json=post_echo_with_str_id(signaal["id"]))
        update_alarm = rm.put(f"{settings.ALARMENSERVICE_URL}/alarms/{alarm_id}", json={"ok": True, "data": alarm_inactive})
        post_afspraak = rm.post(f"{settings.HHB_SERVICES_URL}/afspraken/{afspraak_id}")
        post_gebruikersactiviteit = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201)

        # Mock feature flag "signalen" to be enabled
        mocker.patch('hhb_backend.feature_flags.Unleash.is_enabled', mock_feature_flag("signalen", True))

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
                                    bankTransactions {
                                        id
                                    }
                                    bedragDifference
                                }
                            }
                        }
                    }''',
            },
            content_type='application/json'
        )

        print(f">>> response: {response.json}")

        # assert
        assert fallback.call_count == 0
        assert response.json == {'data': {
            'evaluateAlarms': {
                'alarmTriggerResult': [{
                    'alarm': {'id': '00943958-8b93-4617-aa43-669a9016aad9'},
                    'nextAlarm': {'id': '33738845-7f23-4c8f-8424-2b560a944884'},
                    'signaal': {
                        'id': 'e2b282d9-b31f-451e-9242-11f86c902b35',
                        'bankTransactions': None,
                        'bedragDifference': '120.00'
                    }
                }]
            }
        }}
        assert get_active_alarms.call_count == 1
        assert get_afspraken.call_count == 1
        assert post_alarm.call_count == 1
        assert post_signal.call_count == 1
        assert post_afspraak.call_count == 1
        assert update_alarm.call_count == 2
        assert post_gebruikersactiviteit.call_count == 1



@freeze_time("2021-12-08")
def test_evaluate_one_alarm_via_schema(client, mocker):
    """This tests the evaluation of one alarm via the schema, it should create a new alarm and a signal.
    The schema does not look for journaalposten, so this is an evaluation for alarms that did not get a 
    journaalpost/banktransactie during the day."""
    with requests_mock.Mocker() as rm:
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        get_alarm = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/?filter_ids={alarm_id}", json={'data': [alarm]})
        get_active_alarms = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/?filter_active=true", json={'data': [alarm]})
        get_afspraken = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids={afspraak_id}", json={"data": [afspraak]})
        post_alarm = rm.post(f"{settings.ALARMENSERVICE_URL}/alarms/", status_code=201, json={"ok": True, "data": nextAlarm})
        post_signal = rm.post(f"{settings.SIGNALENSERVICE_URL}/signals/", status_code=201,
                      json=post_echo_with_str_id(signaal["id"]))
        update_alarm = rm.put(f"{settings.ALARMENSERVICE_URL}/alarms/{alarm_id}", json={"ok": True, "data": alarm_inactive})
        post_afspraak = rm.post(f"{settings.HHB_SERVICES_URL}/afspraken/{afspraak_id}")
        post_gebruikersactiviteit = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201)

        # Mock feature flag "signalen" to be enabled
        mocker.patch('hhb_backend.feature_flags.Unleash.is_enabled', mock_feature_flag("signalen", True))

        # act
        response = client.post(
            "/graphql",
            json={
                "query": '''
                    mutation test($id: String!) {
                        evaluateAlarm(id: $id) {
                            alarmTriggerResult {
                                alarm {
                                    id
                                }
                                nextAlarm{
                                    id
                                }
                                signaal{
                                    id
                                    bankTransactions {
                                        id
                                    }
                                    bedragDifference
                                }
                            }
                        }
                    }''', "variables":{"id":alarm_id}
            },
            content_type='application/json'
        )

        print(f">>> response: {response.json}")

        # assert
        assert fallback.call_count == 0
        assert response.json == {'data': {
            'evaluateAlarm': {
                'alarmTriggerResult': [{
                    'alarm': {'id': '00943958-8b93-4617-aa43-669a9016aad9'},
                    'nextAlarm': {'id': '33738845-7f23-4c8f-8424-2b560a944884'},
                    'signaal': {
                        'id': 'e2b282d9-b31f-451e-9242-11f86c902b35',
                        'bankTransactions': None,
                        'bedragDifference': '120.00'
                    }
                }]
            }
        }}
        assert get_alarm.call_count == 1
        assert get_active_alarms.call_count == 1
        assert get_afspraken.call_count == 1
        assert post_alarm.call_count == 1
        assert post_signal.call_count == 1
        assert post_afspraak.call_count == 1
        assert update_alarm.call_count == 2
        assert post_gebruikersactiviteit.call_count == 1