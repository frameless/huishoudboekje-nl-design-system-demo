from tokenize import String
from hhb_backend.graphql.mutations.signalen.signalen import SignaalHelper
from hhb_backend.graphql.mutations.alarmen.alarm import AlarmHelper, CreateAlarmInput
import hhb_backend.graphql as graphql
from hhb_backend.graphql.models.Alarm import Alarm
from hhb_backend.graphql.models.signaal import Signaal
from hhb_backend.graphql.models.afspraak import Afspraak
from hhb_backend.graphql.models.bank_transaction import Bedrag
import graphene
from hhb_backend.graphql.utils.gebruikersactiviteiten import (log_gebruikers_activiteit, gebruikers_activiteit_entities)
import requests
from graphql import GraphQLError
from hhb_backend.graphql import settings
from datetime import *
from dateutil.rrule import rrule, MONTHLY, YEARLY
import calendar
from dateutil.relativedelta import *
import dateutil.parser
import logging


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
        triggered_alarms = evaluateAllAlarms(_root, _info)
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
        evaluated_alarm = evaluateOneAlarm(_root, _info, id)
        return EvaluateAlarm(alarmTriggerResult=evaluated_alarm)


def evaluateAllAlarms(_root, _info, ) -> list:
    triggered_alarms = []
    activeAlarms = getActiveAlarms()
    for alarm in activeAlarms:
        triggered_alarms.append(evaluateAlarm(_root, _info, alarm, activeAlarms))

    return triggered_alarms

def evaluateOneAlarm(_root, _info, id: String) -> list:
    evaluated_alarm = None
    activeAlarms = getActiveAlarms()
    alarm = getAlarm(id)

    if alarm is None:
        return []
        
    alarm_status: bool = alarm.get("isActive")
    if alarm_status == True:
        evaluated_alarm = evaluateAlarm(_root, _info, alarm, activeAlarms)

    if evaluated_alarm is None:
        return []

    return [evaluated_alarm]

def evaluateAlarm(_root, _info, alarm: Alarm, activeAlarms: list):
    triggered_alarms = []
    # get data from afspraak and transactions (by journaalpost reference)
    afspraak = getAfspraakById(alarm.get('afspraakId'))
    journaalIds = afspraak.get("journaalposten", [])
    transacties = getBanktransactiesByJournaalIds(journaalIds)

    alarm_check_date = dateutil.parser.isoparse(alarm.get("startDate")).date() + timedelta(days=(alarm.get("datumMargin") + 1))
    alarm = disableAlarm(alarm_check_date, alarm)
    
    # check if there are transaction within the alarm specified margins
    newAlarm = None
    createdSignaal = None
    if shouldCheckAlarm(alarm):
        newAlarm = shouldCreateNextAlarm(_root, _info, alarm, alarm_check_date, activeAlarms)
        createdSignaal = shouldCreateSignaal(_root, _info, alarm, transacties)
    
    return {
        "alarm": alarm,
        "nextAlarm": newAlarm,
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

def shouldCreateNextAlarm(_root, _info, alarm: Alarm, alarm_check_date: datetime, activeAlarms: list) -> Alarm:
    newAlarm = None
    
    # only generate next alarm if byDay, byMonth, and/or byMonthDay is present
    if (len(alarm.get("byDay", [])) >= 1 or len(alarm.get("byMonth", [])) >= 1 or len(alarm.get("byMonthDay", [])) >= 1): 
        # generate next alarm in the sequence
        nextAlarmDate = generateNextAlarmInSequence(alarm, alarm_check_date) 

        # check if the end date is past or not
        end_date = alarm.get("endDate")
        if end_date is not None:
            if nextAlarmDate > dateutil.parser.isoparse(end_date).date():
                nextAlarmDate = None
                return newAlarm

        # add new alarm in sequence if it does not exist yet
        nextAlarmAlreadyExists = doesNextAlarmExist(nextAlarmDate, alarm, activeAlarms)
        if nextAlarmAlreadyExists == True:
            nextAlarmDate = None
        elif nextAlarmAlreadyExists == False:
            newAlarm = createAlarm(_root, _info, alarm, nextAlarmDate)

    return newAlarm


async def createAlarm(_root, _info, alarm: Alarm, alarmDate: datetime) -> Alarm:
    newAlarm = {
        "isActive": True,
        "gebruikerEmail": alarm.get("gebruikerEmail"),
        "afspraakId": int(alarm.get("afspraakId")),
        "startDate": alarmDate.isoformat(),
        "endDate": alarm.get("endDate"),
        "datumMargin": int(alarm.get("datumMargin")),
        "bedrag": alarm.get("bedrag"),
        "bedragMargin": alarm.get("bedragMargin"),
        "byDay": alarm.get("byDay", []),
        "byMonth": alarm.get("byMonth", []),
        "byMonthDay": alarm.get("byMonthDay", [])
    }
    
    result = await AlarmHelper.create(_root, _info, newAlarm)
    if not result.ok:
        logging.warning("create alarm failed")
        return None
    newAlarm = result.alarm

    return newAlarm

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

# get ByDay, ByMonth and ByMonthDay from alarm
def generateNextAlarmInSequence(alarm: Alarm, alarmDate:datetime) -> datetime:
    # Create next Alarm in the sequence based on byDay, byMonth, byMonthDay cycle
    byDay = alarm.get("byDay", [])
    byMonth = alarm.get("byMonth", [])
    byMonthDay = alarm.get("byMonthDay", [])

    # add one day so it doesnt return the same day
    tommorrow_utc = (datetime.now(timezone.utc) + timedelta(days=1)).date()
    future = max(alarmDate + timedelta(days=1), tommorrow_utc)
    # https://dateutil.readthedocs.io/en/latest/examples.html#rrule-examples
    # isWeekly1 = (byDay is not None and byMonth is None and byMonthDay is None)
    isWeekly = (len(byDay) >= 1 and len(byMonth) <= 0 and len(byMonthDay) <=0)
    # isMontly1 = (byMonth is not None and byMonthDay is not None and byDay is None)
    isMontly = (len(byDay) <= 0 and len(byMonth) >= 1 and len(byMonthDay) >= 1)
    if isWeekly:   # weekly
        weekday_indexes = WeekdayHelper.weekday_names_to_indexes(byDay)
        next_alarm_dates = list(rrule(MONTHLY, dtstart=future, count=1, byweekday=weekday_indexes))
    elif isMontly:    # maandelijk/jaarlijks
        next_alarm_dates = list(rrule(YEARLY, dtstart=future, count=1, bymonth=byMonth, bymonthday=byMonthDay))
    else:
        raise GraphQLError(f"Niet ondersteunde combinatie van alarm herhaal instructies. isWeekly:{isWeekly} isMonthly:{isMontly} byDay:{byDay} byMonth:{byMonth} byMonthDay:{byMonthDay}")

    next_alarm_date: date = next_alarm_dates[0].date()

    return next_alarm_date

async def shouldCreateSignaal(_root, _info, alarm: Alarm, transacties) -> Signaal:
    datum_margin = int(alarm.get("datumMargin"))
    str_expect_date = alarm.get("startDate")
    expect_date = dateutil.parser.isoparse(str_expect_date).date()
    left_date_window = expect_date - timedelta(days=datum_margin)
    right_date_window = expect_date + timedelta(days=datum_margin)

    # Evaluate Alarm
    transaction_in_scope = []
    monetary_deviated_transaction_ids = []
    for transaction in transacties:
        str_transactie_datum=transaction.get("transactie_datum")
        transaction_date = dateutil.parser.isoparse(str_transactie_datum).date()
        monetary_margin = int(alarm.get("bedragMargin"))
        expected_alarm_bedrag = int(alarm.get("bedrag"))
        actual_transaction_bedrag = Bedrag.parse_value(transaction.get("bedrag"))

        if left_date_window <= transaction_date <= right_date_window:
            left_monetary_window = expected_alarm_bedrag - monetary_margin
            right_monetary_window = expected_alarm_bedrag + monetary_margin
            if left_monetary_window <= actual_transaction_bedrag <= right_monetary_window:
                transaction_in_scope.append(transaction)
            else:
                id = transaction.get("id")
                if id:
                    monetary_deviated_transaction_ids.append(id)

    if len(transaction_in_scope) <= 0: 
        alarm_id = alarm.get("id")
        newSignal = {
            "alarmId": alarm_id,
            "banktransactieIds": monetary_deviated_transaction_ids,
            "isActive": True,
            "type": "default"
            # "context": None
        }

        # _root, _info, gebruiken
        result = await SignaalHelper.create(_root, _info, newSignal)
        if not result.ok:
            logging.warning("create signaal failed")
            return None
        newSignal = result.signaal

        newSignalId = newSignal.get("id")
        alarm["signaalId"] = newSignalId
        alarm_response = requests.put(f"{settings.ALARMENSERVICE_URL}/alarms/{alarm_id}", json=alarm, headers={"Content-type": "application/json"})
        if alarm_response.status_code != 200:
            raise GraphQLError(f"Fout bij het update van het alarm met het signaal. {alarm_response.json()}")
        alarm = alarm_response.json()["data"]

        return newSignal
    else:
        return None

class WeekdayHelper:

    @staticmethod
    def weekday_names_to_indexes(weekday_names) -> list:
        indexes = []
        for weekday_name in weekday_names:
            index = WeekdayHelper.weekday_name_to_index(weekday_name)
            indexes.append(index)
        return indexes

    @staticmethod
    def weekday_name_to_index(weekday_name: str) -> int:
        weekday_collection = list(calendar.day_name)
        for index, weekday in enumerate(weekday_collection):
            if weekday == weekday_name:
                return index
        return 0 # monday
