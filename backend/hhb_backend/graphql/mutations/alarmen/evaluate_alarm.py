import dateutil.parser
import graphene
import logging
import requests
from datetime import *
from graphql import GraphQLError
from tokenize import String
from typing import List, Optional

from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models import alarm, signaal
from hhb_backend.graphql.models.bank_transaction import Bedrag
from hhb_backend.graphql.mutations.alarmen.alarm import generate_alarm_date
from hhb_backend.graphql.mutations.alarmen.create_alarm import CreateAlarm, AlarmHelper
from hhb_backend.graphql.mutations.signalen.signalen import SignaalHelper
from hhb_backend.graphql.utils.dates import to_date
from hhb_backend.graphql.utils.gebruikersactiviteiten import log_gebruikers_activiteit, gebruikers_activiteit_entities
from hhb_backend.graphql.utils.upstream_error_handler import UpstreamError
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
        triggered_alarms = await evaluate_alarms(ids)
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
    async def mutate(_root, _info, id):
        """ Mutatie voor de evaluatie van een alarm wat kan resulteren in een signaal en/of een nieuw alarm in de reeks. """
        evaluated_alarm = await evaluate_one_alarm(id)
        return EvaluateAlarm(alarmTriggerResult=evaluated_alarm)


async def evaluate_alarms(ids: list[String] = []) -> list:
    logging.info(f"Evaluating alarms")
    triggered_alarms = []
    active_alarms = get_active_alarms()
    if ids:
        alarmen = hhb_dataloader().alarms.load(ids)
        for alarm in alarmen:
            if alarm.isActive:
                triggered_alarms.append(await evaluate_alarm(alarm, active_alarms))
    else: 
        for alarm in active_alarms:
            triggered_alarms.append(await evaluate_alarm(alarm, active_alarms))

    return triggered_alarms


async def evaluate_one_alarm(id: String) -> list:
    evaluated_alarm = None
    active_alarms = get_active_alarms()
    alarm_ = get_alarm(id)

    if alarm_ is None:
        return []

    alarm_status: bool = alarm_.isActive
    if alarm_status:
        evaluated_alarm = await evaluate_alarm(alarm_, active_alarms)

    if evaluated_alarm is None:
        return []

    return [evaluated_alarm]


async def evaluate_alarm(alarm_: Alarm, active_alarms: List[Alarm]):
    logging.debug(f"Evaluating alarm {alarm_}")
    # get data from afspraak and transactions (by journaalpost reference)
    afspraak = get_afspraak_by_id(alarm_.afspraakId)
    journaal_ids = afspraak.journaalposten
    transactions = get_banktransactions_by_journaal_ids(journaal_ids)

    alarm_check_date = to_date(alarm_.startDate) + timedelta(days=(alarm_.get("datumMargin") + 1))
    alarm_ = disable_alarm(alarm_check_date, alarm_)

    # check if there are transaction within the alarm specified margins
    next_alarm = None
    created_signaal = None
    if should_check_alarm(alarm_):
        next_alarm = await should_create_next_alarm(alarm_, alarm_check_date, active_alarms)
        created_signaal = await should_create_signaal(alarm_, transactions)

    return {
        "alarm": alarm_,
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


async def should_create_next_alarm(alarm: Alarm, alarm_check_date: date, active_alarms: List[Alarm]) -> Optional[Alarm]:
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
            return await create_alarm(alarm)

    return None


async def create_alarm(alarm: Alarm) -> Optional[Alarm]:
    result = await AlarmHelper.create({
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
    day_after_expected_window = alarm_date + timedelta(
        days=(date_margin + 1))  # plus one to make sure the alarm is checked after the expected date range.
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
    if not journaal_ids:
        return []
    journaalposts = hhb_dataloader().journaalposten.load(journaal_ids)
    transaction_ids = [journaalpost.transaction_id for journaalpost in journaalposts]
    return hhb_dataloader().bank_transactions.load(transaction_ids)


async def should_create_signaal(alarm: Alarm, transacties: List[BankTransaction]) -> Optional[Signaal]:
    createSignal, difference, monetary_deviated_transaction_ids = get_bedrag_difference(alarm, transacties)
    if createSignal:
        alarm_id = alarm.id
        new_signal = {
            "alarmId": alarm_id,
            "banktransactieIds": monetary_deviated_transaction_ids,
            "isActive": True,
            "type": "default",
            "bedragDifference": difference
        }

        new_signal = await create_signaal(new_signal)
        new_signal_id = new_signal.id
        update_alarm_signal_id(alarm, new_signal_id)

        return new_signal
    else:
        return None


async def create_signaal(new_signal) -> Signaal:
    return (SignaalHelper.create(new_signal)).signaal

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
    """ Determines the amount difference between the transactions and the expected amount in the alarm. 
    Returns if a signal needs to be created, the difference, and the monetary deviating transaction ids. """
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
    monetary_deviated_transaction_ids = []
    transaction_ids_out_of_scope = []       # not used at the moment, but see reference GitLab issue #1099 https://gitlab.com/commonground/huishoudboekje/app-new/-/issues/1099
    bedrag = 0
    createSignal = False

    # check transactions
    for transaction in transacties:
        str_transactie_datum = transaction.transactie_datum
        transaction_date = to_date(str_transactie_datum)

        if left_date_window <= transaction_date <= right_date_window:
            bedrag += transaction.bedrag
            if left_monetary_window > transaction.bedrag or transaction.bedrag > right_monetary_window:
                monetary_deviated_transaction_ids.append(transaction.id)
        else:
            transaction_ids_out_of_scope.append(transaction.id)

    diff = abs(bedrag - expected_alarm_bedrag)

    difference = Bedrag.serialize(diff)

    if diff <= monetary_margin:
        monetary_deviated_transaction_ids = []
    else:
        createSignal = True
        
    return createSignal, difference, monetary_deviated_transaction_ids
