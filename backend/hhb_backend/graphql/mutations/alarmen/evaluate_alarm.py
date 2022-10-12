import logging
from datetime import *
from tokenize import String
from typing import List, Optional

import dateutil.parser
import graphene
import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models import alarm, signaal
from hhb_backend.graphql.models.bank_transaction import Bedrag
from hhb_backend.graphql.mutations.alarmen.alarm import generate_alarm_date
from hhb_backend.graphql.mutations.alarmen.create_alarm import CreateAlarm
from hhb_backend.graphql.mutations.signalen.signalen import SignaalHelper
from hhb_backend.graphql.utils.gebruikersactiviteiten import log_gebruikers_activiteit, gebruikers_activiteit_entities
from hhb_backend.graphql.utils.dates import to_date
from hhb_backend.service.model.afspraak import Afspraak
from hhb_backend.service.model.alarm import Alarm
from hhb_backend.service.model.bank_transaction import BankTransaction
from hhb_backend.service.model.signaal import Signaal


class AlarmTriggerResult(graphene.ObjectType):
    alarm = graphene.Field(lambda: alarm.Alarm)
    nextAlarm = graphene.Field(lambda: alarm.Alarm)
    signaal = graphene.Field(lambda: signaal.Signaal)


class EvaluateAlarms(graphene.Mutation):
    class Arguments:
        ids = graphene.List(graphene.String, default_value=[])

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
    async def mutate(_root, _info, ids):
        """ Mutatie voor de evaluatie van een alarm wat kan resulteren in een signaal en/of een nieuw alarm in de reeks. """
        triggered_alarms = await evaluate_alarms(_root, _info, ids)
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


async def evaluate_alarms(root, info, ids: list[String]) -> list:
    triggered_alarms = []
    active_alarms = get_active_alarms()
    if ids:
        alarmen = hhb_dataloader().alarms.load(ids)
        for alarm in alarmen:
            triggered_alarms.append(await evaluate_alarm(root, info, alarm, active_alarms))
    else: 
        for alarm in active_alarms:
            triggered_alarms.append(await evaluate_alarm(root, info, alarm, active_alarms))

    return triggered_alarms

async def evaluate_one_alarm(root, info, id: String) -> list:
    evaluated_alarm = None
    active_alarms = get_active_alarms()
    alarm = get_alarm(id)

    if alarm is None:
        return []

    alarm_status: bool = alarm.isActive
    if alarm_status:
        evaluated_alarm = await evaluate_alarm(root, info, alarm, active_alarms)

    if evaluated_alarm is None:
        return []

    return [evaluated_alarm]


async def evaluate_alarm(root, info, alarm: Alarm, active_alarms: List[Alarm]):
    # get data from afspraak and transactions (by journaalpost reference)
    afspraak = get_afspraak_by_id(alarm.afspraakId)
    journaal_ids = afspraak.journaalposten
    transactions = get_banktransactions_by_journaal_ids(journaal_ids)

    alarm_check_date = to_date(alarm.startDate) + timedelta(days=(alarm.get("datumMargin") + 1))
    alarm = disable_alarm(alarm_check_date, alarm)

    # check if there are transaction within the alarm specified margins
    next_alarm = None
    created_signaal = None
    if should_check_alarm(alarm):
        next_alarm = await should_create_next_alarm(root, info, alarm, alarm_check_date, active_alarms)
        created_signaal = await should_create_signaal(root, info, alarm, transactions)

    return {
        "alarm": alarm,
        "nextAlarm": next_alarm,
        "signaal": created_signaal
    }


def disable_alarm(alarm_check_date: date, alarm: Alarm) -> Alarm:
    if alarm_check_date <= date.today():
        update_alarm_activity(alarm, False)
    return alarm


def does_next_alarm_exist(next_alarm_date: date, alarm: Alarm, alarms: List[Alarm]) -> bool:
    for check in alarms:
        str_alarm_date = check.startDate
        alarm_check_date = to_date(str_alarm_date)

        if alarm.id == check.id:
            continue
        elif check.afspraakId == alarm.afspraakId and next_alarm_date == alarm_check_date:
            return True

    return False


async def should_create_next_alarm(_root, _info, alarm: Alarm, alarm_check_date: date,
                                   active_alarms: List[Alarm]) -> Optional[Alarm]:
    # only generate next alarm if byDay, byMonth, and/or byMonthDay is present
    if alarm.byDay or alarm.byMonth or alarm.byMonthDay:
        # generate next alarm in the sequence
        next_alarm_date = generate_alarm_date(alarm, alarm_check_date)

        # check if the end date is past or not
        end_date = alarm.endDate
        if end_date:
            if next_alarm_date > to_date(end_date):
                return None

        # add new alarm in sequence if it does not exist yet
        next_alarm_already_exists = does_next_alarm_exist(next_alarm_date, alarm, active_alarms)
        if not next_alarm_already_exists:
            return await create_alarm(_root, _info, alarm, next_alarm_date)

    return None


async def create_alarm(root, info, alarm: Alarm, alarm_date: date) -> Optional[Alarm]:
    result = await CreateAlarm.mutate(root, info, {
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


def should_check_alarm(alarm: Alarm) -> bool:
    # is the alarm set in the past, or the future
    str_alarm_date = alarm.startDate
    alarm_date = dateutil.parser.isoparse(str_alarm_date).date()
    date_margin = int(alarm.datumMargin)
    day_after_expected_window = alarm_date + timedelta(days=(date_margin + 1))   # plus one to make sure the alarm is checked after the expected date range.
    utc_now_date = (datetime.now(timezone.utc)).date()

    # if now or in the past, it should be checked
    return day_after_expected_window <= utc_now_date


def get_active_alarms() -> List[Alarm]:
    return hhb_dataloader().alarms.load_active()


def get_alarm(id: String) -> Optional[Alarm]:
    # todo add isActive filter in service
    alarm = hhb_dataloader().alarms.load_one(id)
    return alarm if alarm and alarm.isActive else None


def get_afspraak_by_id(afspraak_id: int) -> Optional[Afspraak]:
    return hhb_dataloader().afspraken.load_one(afspraak_id)


def get_banktransactions_by_journaal_ids(journaal_ids) -> List[BankTransaction]:
    journaalposts = hhb_dataloader().journaalposten.load(journaal_ids)
    transaction_ids = [journaalpost.transaction_id for journaalpost in journaalposts]
    return hhb_dataloader().bank_transactions.load(transaction_ids)


async def should_create_signaal(root, info, alarm: Alarm, transacties: List[BankTransaction]) -> Optional[Signaal]:
    difference, transaction_ids_out_of_scope, monetary_deviated_transaction_ids = get_bedrag_difference(alarm, transacties)

    if len(transaction_ids_out_of_scope) > 0 or len(monetary_deviated_transaction_ids) > 0 or len(transacties) == 0:
        alarm_id = alarm.id
        new_signal = {
            "alarmId": alarm_id,
            "banktransactieIds": monetary_deviated_transaction_ids + transaction_ids_out_of_scope,
            "isActive": True,
            "type": "default",
            "bedragDifference": difference
        }

        new_signal = await create_signaal(root, info, new_signal)
        new_signal_id = new_signal.id
        update_alarm_signal_id(alarm, new_signal_id)

        return new_signal
    else:
        return None


async def create_signaal(root, info, new_signal) -> Signaal:
    return (await SignaalHelper.create(root, info, new_signal)).signaal

def update_alarm_signal_id(alarm: Alarm, new_signal_id):
    alarm_id = alarm.id
    alarm.signaalId = new_signal_id
    alarm_update = {"signaalId": new_signal_id}
    update_alarm(alarm_id, alarm_update)

def update_alarm_activity(alarm: Alarm, is_active: bool):
    alarm_id = alarm.id
    alarm.isActive = is_active
    alarm_update = {"isActive": is_active}
    update_alarm(alarm_id, alarm_update)

def update_alarm(alarm_id: str, alarm_update: dict):
    alarm_response = requests.put(f"{settings.ALARMENSERVICE_URL}/alarms/{alarm_id}", json=alarm_update, headers={"Content-type": "application/json"})
    if alarm_response.status_code != 200:
        raise GraphQLError(f"Failed to update alarm. {alarm_response.json()}")

def get_bedrag_difference(alarm: Alarm, transacties: List[BankTransaction]):
    # expected dates
    datum_margin = int(alarm.datumMargin)
    str_expect_date = alarm.startDate
    expect_date = to_date(str_expect_date)
    left_date_window = expect_date - timedelta(days=datum_margin)
    right_date_window = expect_date + timedelta(days=datum_margin)

    # expected amounts
    expected_alarm_bedrag = int(alarm.bedrag)
    monetary_margin = int(alarm.bedragMargin)
    left_monetary_window = expected_alarm_bedrag - monetary_margin
    right_monetary_window = expected_alarm_bedrag + monetary_margin

    # initialize
    transactions_in_scope = []
    monetary_deviated_transaction_ids = []
    transaction_ids_out_of_scope = []
    bedrag = 0

    # check transactions
    for transaction in transacties:
        str_transactie_datum = transaction.transactie_datum
        transaction_date = to_date(str_transactie_datum)

        if left_date_window <= transaction_date <= right_date_window:
            if left_monetary_window <= transaction.bedrag <= right_monetary_window:
                transactions_in_scope.append(transaction)
            else:
                monetary_deviated_transaction_ids.append(transaction.id)
                bedrag += transaction.bedrag
        else:
            transaction_ids_out_of_scope.append(transaction.id)

    if len(transactions_in_scope) > 0 and len(transaction_ids_out_of_scope) == 0 and len(monetary_deviated_transaction_ids) == 0: 
        for t in transactions_in_scope: 
            bedrag += t.bedrag

    diff = -1 * (abs(bedrag) - abs(expected_alarm_bedrag))

    difference = Bedrag.serialize(diff)

    if left_monetary_window <= bedrag <= right_monetary_window:
        monetary_deviated_transaction_ids = []
    
    return difference, transaction_ids_out_of_scope, monetary_deviated_transaction_ids