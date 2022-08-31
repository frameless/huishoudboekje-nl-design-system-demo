import logging
from datetime import *
from tokenize import String
from typing import Optional

import dateutil.parser
import graphene
import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings
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
        triggered_alarms = await evaluateAllAlarms(_root, _info)
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
        evaluated_alarm = await evaluateOneAlarm(_root, _info, id)
        return EvaluateAlarm(alarmTriggerResult=evaluated_alarm)


async def evaluateAllAlarms(_root, _info, ) -> list:
    triggered_alarms = []
    activeAlarms = getActiveAlarms()
    for alarm in activeAlarms:
        triggered_alarms.append(await evaluateAlarm(_root, _info, alarm, activeAlarms))

    return triggered_alarms

async def evaluateOneAlarm(_root, _info, id: String) -> list:
    evaluated_alarm = None
    activeAlarms = getActiveAlarms()
    alarm = getAlarm(id)

    if alarm is None:
        return []

    alarm_status: bool = alarm.get("isActive")
    if alarm_status == True:
        evaluated_alarm = await evaluateAlarm(_root, _info, alarm, activeAlarms)

    if evaluated_alarm is None:
        return []

    return [evaluated_alarm]

async def evaluateAlarm(_root, _info, alarm: Alarm, activeAlarms: list):
    # get data from afspraak and transactions (by journaalpost reference)
    afspraak = getAfspraakById(alarm.get('afspraakId'))
    journaalIds = afspraak.get("journaalposten", [])
    transacties = getBanktransactiesByJournaalIds(journaalIds)

    alarm_check_date = dateutil.parser.isoparse(alarm.get("startDate")).date() + timedelta(days=(alarm.get("datumMargin") + 1))
    alarm = disableAlarm(alarm_check_date, alarm)

    # check if there are transaction within the alarm specified margins
    new_alarm = None
    createdSignaal = None
    if shouldCheckAlarm(alarm):
        new_alarm = await should_create_next_alarm(_root, _info, alarm, alarm_check_date, activeAlarms)
        createdSignaal = await shouldCreateSignaal(_root, _info, alarm, transacties)

    return {
        "alarm": alarm,
        "nextAlarm": new_alarm,
        "signaal": createdSignaal
    }

def disableAlarm(alarmCheckDate: date, alarm: Alarm) -> Alarm:
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
        "startDate": alarm_date.isoformat(),
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

def getActiveAlarms() -> list:
    alarm_response = requests.get(f"{settings.ALARMENSERVICE_URL}/alarms/", headers={"Content-type": "application/json"})
    if alarm_response.status_code != 200:
        raise GraphQLError(f"Upstream API responded on getActiveAlarms: {alarm_response.json()}")
    alarms = alarm_response.json()["data"]

    activeAlarms = []
    for alarm in alarms:
        # is the alarm active
        alarm_status: bool = alarm.get("isActive")
        if alarm_status == True:
            activeAlarms.append(alarm)

    return activeAlarms

def getAlarm(id: String) -> Alarm:
    alarm_response = requests.get(f"{settings.ALARMENSERVICE_URL}/alarms/{id}", headers={"Content-type": "application/json"})
    if alarm_response.status_code != 200:
        raise GraphQLError(f"Upstream API responded on getAlarm({id}): {alarm_response.json()}")
    alarm = alarm_response.json()["data"]

    if alarm is not None:
        if alarm.get("isActive"):
            return alarm

    return None

def getAfspraakById(afspraakId: int) -> Afspraak:
    afspraak_response = requests.get(f"{settings.HHB_SERVICES_URL}/afspraken/{afspraakId}", headers={"Content-type": "application/json"})
    if afspraak_response.status_code != 200:
        raise GraphQLError(f"Upstream API responded: {afspraak_response.json()}")
    afspraak = afspraak_response.json()['data']

    return afspraak
    # return {
    #     "aantal_betalingen": None,
    #     "afdeling_id": None,
    #     "bedrag": 120,
    #     "betaalinstructie": {
    #         "by_day": ["Wednesday", "Friday"], # Monday, Tuesday, Wednesday, Thursday, Friday, Saterday, Sunday
    #         # "by_month": [1,2,3,4,5,6,7,8,9,10,11,12],
    #         # "by_month_day": [10],
    #         "start_date": "2019-01-01"
    #     },
    #     "burger_id": 2,
    #     "credit": False,
    #     "id": 19,
    #     "journaalposten": [1]
    # }

def getBanktransactiesByJournaalIds(journaalIds) -> list:
    journaalposts = []
    transacties = []
    for journaalpostId in journaalIds:
    # get journaalposts
        journaalposten_response = requests.get(f"{settings.HHB_SERVICES_URL}/journaalposten/{journaalpostId}", headers={"Content-type": "application/json"})
        if journaalposten_response.status_code != 200:
            raise GraphQLError(f"Upstream API responded: {journaalposten_response.json()}")
        journaalpost = journaalposten_response.json()['data']
        journaalposts.append(journaalpost)

        banktransactionId = journaalpost.get("transaction_id")
    # get banktransactions
        banktransactions_response = requests.get(f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/{banktransactionId}", headers={"Content-type": "application/json"})
        if banktransactions_response.status_code != 200:
            raise GraphQLError(f"Upstream API responded: {banktransactions_response.json()}")
        banktransaction = banktransactions_response.json()['data']
        transacties.append(banktransaction)

    return transacties
    # return [
    #     {
    #         "bedrag": 120,
    #         "customer_statement_message_id": 15,
    #         "id": 481,
    #         "information_to_account_owner": "NL83ABNA1927261899               Leefgeld ZOEKTERMPERSONA2 januari 2019",
    #         "is_credit": False,
    #         "is_geboekt": True,
    #         "statement_line": "190101D-1195.20NMSC028",
    #         "tegen_rekening": "NL83ABNA1927261899",
    #         "transactie_datum": "2021-12-01"
    #     }
    # ]


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
        str_transactie_datum=transaction.get("transactie_datum")
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
        newSignal = {
            "alarmId": alarm_id,
            "banktransactieIds": monetary_deviated_transaction_ids,
            "isActive": True,
            "type": "default",
            "bedragDifference": difference
        }

        newSignal = await createSignaal(_root, _info, newSignal)
        newSignalId = newSignal.get("id")
        updateAlarm(alarm, alarm_id, newSignalId)

        return newSignal
    else:
        return None

async def createSignaal(_root, _info, newSignal) -> Signaal:
    result = await SignaalHelper.create(_root, _info, newSignal)
    if not result.ok:
        logging.warning("Create signaal failed")
        return None
    newSignal = result.signaal

    return newSignal

def updateAlarm(alarm, alarm_id, newSignalId):
    alarm["signaalId"] = newSignalId
    alarm_response = requests.put(f"{settings.ALARMENSERVICE_URL}/alarms/{alarm_id}", json=alarm, headers={"Content-type": "application/json"})
    if alarm_response.status_code != 200:
        raise GraphQLError(f"Fout bij het update van het alarm met het signaal. {alarm_response.json()}")
    alarm = alarm_response.json()["data"]