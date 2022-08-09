import logging
from datetime import *
from tokenize import String
from typing import Optional

import dateutil.parser
import graphene
import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.Alarm import Alarm
from hhb_backend.graphql.models.afspraak import Afspraak
from hhb_backend.graphql.models.bank_transaction import Bedrag
from hhb_backend.graphql.models.signaal import Signaal
from hhb_backend.graphql.mutations.alarmen.alarm import AlarmHelper, generate_alarm_date
from hhb_backend.graphql.mutations.signalen.signalen import SignaalHelper
from hhb_backend.graphql.utils.gebruikersactiviteiten import (log_gebruikers_activiteit, gebruikers_activiteit_entities)


class AlarmTriggerResult(graphene.ObjectType):
    alarm = graphene.Field(lambda: Alarm)
    nextAlarm = graphene.Field(lambda: Alarm)
    signaal = graphene.Field(lambda: Signaal)

class EvaluateAlarms(graphene.Mutation):
    alarmTriggerResult = graphene.List(lambda: AlarmTriggerResult)

    def gebruikers_activiteit(self, _root, info, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="alarm", result=self, key="alarm"
            ),
            after=dict(),
        )

    @staticmethod
    @log_gebruikers_activiteit
    async def mutate(_root, _info):
        """ Mutatie voor de evaluatie van een alarm wat kan resulteren in een signaal en/of een nieuw alarm in de reeks. """
        triggered_alarms = await evaluate_all_alarms(_root, _info)
        return EvaluateAlarms(alarmTriggerResult=triggered_alarms)


class EvaluateAlarm(graphene.Mutation):
    class Arguments:
        id = graphene.String(required=True)

    alarmTriggerResult = graphene.List(lambda: AlarmTriggerResult)

    def gebruikers_activiteit(self, _root, info, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="alarm", result=self, key="alarm"
            ),
            after=dict(),
        )

    @staticmethod
    @log_gebruikers_activiteit
    async def mutate(root, info, id):
        """ Mutatie voor de evaluatie van een alarm wat kan resulteren in een signaal en/of een nieuw alarm in de reeks. """
        evaluated_alarm = await evaluate_one_alarm(root, info, id)
        return EvaluateAlarm(alarmTriggerResult=evaluated_alarm)


async def evaluate_all_alarms(root, info) -> list:
    triggered_alarms = []
    active_alarms = get_active_alarms()
    for alarm in active_alarms:
        triggered_alarms.append(await evaluate_alarm(root, info, alarm, active_alarms))

    return triggered_alarms

async def evaluate_one_alarm(root, info, id: String) -> list:
    evaluated_alarm = None
    active_alarms = get_active_alarms()  # todo moeten alle alarmen opgehaald worden?
    alarm = get_alarm(id)

    if alarm is None:
        return []

    alarm_status: bool = alarm.get("isActive")
    if alarm_status:
        evaluated_alarm = await evaluate_alarm(root, info, alarm, active_alarms)

    if evaluated_alarm is None:
        return []

    return [evaluated_alarm]

async def evaluate_alarm(root, info, alarm: dict, active_alarms: list[dict]):
    # get data from afspraak and transactions (by journaalpost reference)
    afspraak = get_afspraak_by_id(alarm.get('afspraakId'))
    journaal_ids = afspraak.get("journaalposten", [])
    transactions = get_banktransactions_by_journaal_ids(journaal_ids)

    alarm_check_date = dateutil.parser.isoparse(alarm.get("startDate")).date() + timedelta(days=(alarm.get("datumMargin") + 1))
    alarm = disable_alarm(alarm_check_date, alarm)
    
    # check if there are transaction within the alarm specified margins
    next_alarm = None
    created_signaal = None
    if shouldCheckAlarm(alarm):
        new_alarm = await should_create_next_alarm(_root, _info, alarm, alarm_check_date, activeAlarms)
        created_signaal = should_create_signaal(root, info, alarm, transactions)
    
    return {
        "alarm": alarm,
        "nextAlarm": next_alarm,
        "signaal": created_signaal
    }

def disable_alarm(alarmCheckDate: date, alarm: dict) -> dict:
    utc_now_date = (datetime.now(timezone.utc)).date()
    if alarmCheckDate < utc_now_date:
        alarm["isActive"] = False
    return alarm

def doesNextAlarmExist(nextAlarmDate: date, alarm: Alarm, alarms: list) -> bool:
    afspraakId = alarm.get('afspraakId')
    for check in alarms:
        str_alarm_date = check.get("startDate")
        checkAfspraakId = check.get("afspraakId")
        checkId = check.get("id")
        alarmId = alarm.get("id")
        alarm_check_date = dateutil.parser.isoparse(str_alarm_date).date()

        if alarmId == checkId:
            continue
        elif checkAfspraakId == afspraakId and nextAlarmDate == alarm_check_date:
            return True

    return False


async def should_create_next_alarm(root, info, alarm, alarm_check_date: date, active_alarms: list) -> Optional[Alarm]:
    # only generate next alarm if byDay, byMonth, and/or byMonthDay is present
    if len(alarm.get("byDay", [])) >= 1 or len(alarm.get("byMonth", [])) >= 1 or len(alarm.get("byMonthDay", [])) >= 1:
        # generate next alarm in the sequence
        next_alarm_date = generate_alarm_date(alarm, alarm_check_date)

        # check if the end date is past or not
        end_date = alarm.get("endDate")
        if end_date and next_alarm_date > dateutil.parser.isoparse(end_date).date():
            return None

        # add new alarm in sequence if it does not exist yet
        next_alarm_already_exists = doesNextAlarmExist(next_alarm_date, alarm, active_alarms)
        if not next_alarm_already_exists:
            return await create_alarm(root, info, alarm, next_alarm_date)

    return None


async def create_alarm(root, info, alarm: Alarm, alarm_date: date) -> Optional[Alarm]:
    result = await AlarmHelper.create(root, info, {
        "isActive": True,
        "afspraakId": int(alarm.get("afspraakId")),
        "endDate": alarm.get("endDate"),
        "datumMargin": int(alarm.get("datumMargin")),
        "bedrag": alarm.get("bedrag"),
        "bedragMargin": alarm.get("bedragMargin"),
        "byDay": alarm.get("byDay", []),
        "byMonth": alarm.get("byMonth", []),
        "byMonthDay": alarm.get("byMonthDay", [])
    })

    if not result.ok:
        logging.warning("create alarm failed")
        return None
    return result.alarm


def shouldCheckAlarm(alarm: Alarm) -> bool:
    # is the alarm set in the past, or the future
    str_alarm_date = alarm.get("startDate")
    alarm_date = dateutil.parser.isoparse(str_alarm_date).date()
    date_margin = int(alarm.get("datumMargin"))
    day_after_expected_window = alarm_date + timedelta(days=(date_margin + 1))   # plus one to make sure the alarm is checked after the expected date range.
    utc_now_date = (datetime.now(timezone.utc)).date()

    # if now or in the past, it should be checked
    return day_after_expected_window <= utc_now_date

def get_active_alarms() -> list[dict]:
    return hhb_dataloader().alarmen.load_active()

def get_alarm(id: String) -> dict | None:
    alarm = hhb_dataloader().alarm_by_id.load(id)
    if alarm is not None and alarm.get("isActive"):
        return alarm

    return None

def get_afspraak_by_id(afspraakId: int) -> dict:
    return hhb_dataloader().afspraak_by_id.load(afspraakId)

async def get_banktransactions_by_journaal_ids(journaal_ids) -> list[dict]:
    journaalposts = []
    transactions = []
    for journaalpost_id in journaal_ids:
        journaalpost = hhb_dataloader().journaalpost_by_id.load(journaalpost_id)
        journaalposts.append(journaalpost)

        bank_transaction_id = journaalpost.get("transaction_id")
        transactions.append(
            hhb_dataloader().bank_transaction_by_id.load(bank_transaction_id)
        )

    return transactions


async def shouldCreateSignaal(_root, _info, alarm: Alarm, transacties) -> Signaal:
    # expected dates
    datum_margin = int(alarm.get("datumMargin"))
    str_expect_date = alarm.get("startDate")
    expect_date = dateutil.parser.isoparse(str_expect_date).date()
    left_date_window = expect_date - timedelta(days=datum_margin)
    right_date_window = expect_date + timedelta(days=datum_margin)

    # expected amounts
    expected_alarm_bedrag = int(alarm.get("bedrag"))
    monetary_margin = int(alarm.get("bedragMargin"))
    left_monetary_window = expected_alarm_bedrag - monetary_margin
    right_monetary_window = expected_alarm_bedrag + monetary_margin

    # initialize
    transaction_in_scope = []
    monetary_deviated_transaction_ids = []
    bedrag = 0
    
    # check transactions 
    for transaction in transacties:
        str_transactie_datum = transaction.get("transactie_datum")
        transaction_date = dateutil.parser.isoparse(str_transactie_datum).date()
        actual_transaction_bedrag = int(transaction.get("bedrag"))

        if left_date_window <= transaction_date <= right_date_window:
            if left_monetary_window <= actual_transaction_bedrag <= right_monetary_window:
                transaction_in_scope.append(transaction)
            else:
                id = transaction.get("id")
                if id:
                    monetary_deviated_transaction_ids.append(id)
                    bedrag += actual_transaction_bedrag

    diff = bedrag - expected_alarm_bedrag
    difference = Bedrag.serialize(diff)

    if left_monetary_window <= bedrag <= right_monetary_window:
        monetary_deviated_transaction_ids = []

    if len(transaction_in_scope) <= 0 or len(monetary_deviated_transaction_ids) > 0:
        alarm_id = alarm.get("id")
        new_signal = {
            "alarmId": alarm_id,
            "banktransactieIds": monetary_deviated_transaction_ids,
            "isActive": True,
            "type": "default",
            "bedragDifference": difference
        }

        new_signal = create_signaal(root, info, new_signal)
        new_signal_id = new_signal.get("id")
        updateAlarm(alarm, alarm_id, new_signal_id)

        return new_signal
    else:
        return None


def create_signaal(root, info, new_signal) -> Signaal:
    return SignaalHelper.create(root, info, new_signal).signaal


def updateAlarm(alarm, alarm_id, newSignalId):
    alarm["signaalId"] = newSignalId
    alarm_response = requests.put(f"{settings.ALARMENSERVICE_URL}/alarms/{alarm_id}", json=alarm, headers={"Content-type": "application/json"})
    if alarm_response.status_code != 200:
        raise GraphQLError(f"Fout bij het update van het alarm met het signaal. {alarm_response.json()}")
    alarm = alarm_response.json()["data"]