from hhb_backend.graphql.models.Alarm import Alarm
from hhb_backend.graphql.models.signaal import Signal
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

class AlarmTriggerResult(graphene.ObjectType):
    alarm = graphene.Field(lambda: Alarm)
    nextAlarm = graphene.Field(lambda: Alarm)
    Signal = graphene.Field(lambda: Signal)

class EvaluateAlarm(graphene.Mutation):
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
        triggered_alarms = []
        activeAlarms = EvaluateAlarm.getActiveAlarms()
        for alarm in activeAlarms:
            # get data from afspraak and transactions (by journaalpost reference)
            afspraak = EvaluateAlarm.getAfspraakById(alarm.get('afspraakId'))
            journaalIds = afspraak.get("journaalposten", [])
            transacties = EvaluateAlarm.getBanktransactiesByJournaalIds(journaalIds)

            # generate next alarm in the sequence
            alarm_check_date = dateutil.parser.isoparse(alarm.get("datum")).date()
            nextAlarmDate = EvaluateAlarm.generateNextAlarmInSequence(alarm, alarm_check_date)
            alarm = EvaluateAlarm.disableAlarm(alarm_check_date, alarm)

            # add new alarm in sequence if it does not exist yet
            nextAlarmAlreadyExists = EvaluateAlarm.doesNextAlarmExist(nextAlarmDate, alarm, activeAlarms)
            newAlarm = None
            if nextAlarmAlreadyExists == True:
                nextAlarmDate = None
            elif nextAlarmAlreadyExists == False:
                newAlarm = EvaluateAlarm.createAlarm(alarm, nextAlarmDate)

            # check if there are transaction within the alarm specified margins
            createSignaal = None
            if EvaluateAlarm.shouldCheckAlarm(alarm):
                createSignaal = EvaluateAlarm.shouldCreateSignaal(alarm, transacties)
            
            triggered_alarms.append({
                "alarm": alarm,
                "nextAlarm": newAlarm,
                "Signal": createSignaal
            })

        return EvaluateAlarm(alarmTriggerResult=triggered_alarms)

    def disableAlarm(alarmDate: date, alarm: Alarm) -> Alarm:
        utc_now_date = (datetime.now(timezone.utc)).date()
        if alarmDate < utc_now_date:
            alarm["isActive"] = False
        return alarm

    def doesNextAlarmExist(nextAlarmDate: date, alarm: Alarm, alarms: list) -> bool:
        afspraakId = alarm.get('afspraakId')
        for check in alarms:
            str_alarm_date = check.get("datum")
            checkAfspraakId = check.get("afspraakId")
            checkId = check.get("id")
            alarmId = alarm.get("id")
            alarm_check_date = dateutil.parser.isoparse(str_alarm_date).date()

            if alarmId == checkId:
                continue
            elif checkAfspraakId == afspraakId and nextAlarmDate == alarm_check_date:
                return True
        
        return False

    def createAlarm(alarm: Alarm, alarmDate: datetime) -> Alarm:
        newAlarm = {
            "isActive": True,
            "gebruikerEmail": alarm.get("gebruikerEmail"),
            "afspraakId": int(alarm.get("afspraakId")),
            "datum": alarmDate.isoformat(),
            "datumMargin": int(alarm.get("datumMargin")),
            "bedrag": alarm.get("bedrag"),
            "bedragMargin": alarm.get("bedragMargin"),
            "byDay": alarm.get("byDay"),
            "byMonth": alarm.get("byMonth"),
            "byMonthDay": alarm.get("byMonthDay")
        }

        alarm_response = requests.post(f"{settings.ALARMENSERVICE_URL}/alarms/", json=newAlarm, headers={"Content-type": "application/json"})
        if alarm_response.status_code != 201:
            raise GraphQLError(f"Upstream API responded: {alarm_response.json()}")
        newAlarm = alarm_response.json()["data"]

        return newAlarm

    def shouldCheckAlarm(alarm: Alarm) -> bool:
        # is the alarm set in the past, or the future
        str_alarm_date = alarm.get("datum")
        alarm_date = dateutil.parser.isoparse(str_alarm_date).date()
        utc_now_date = (datetime.now(timezone.utc)).date()
        if alarm_date < utc_now_date:
            return False
        elif alarm_date > utc_now_date:
            return False

        # past all checks so the it passes the base validation
        return True

    def getActiveAlarms() -> list:
        alarm_response = requests.get(f"{settings.ALARMENSERVICE_URL}/alarms/", headers={"Content-type": "application/json"})
        if alarm_response.status_code != 200:
            raise GraphQLError(f"Upstream API responded: {alarm_response.json()}")
        alarms = alarm_response.json()["data"]

        activeAlarms = []
        for alarm in alarms:
            # is the alarm active
            alarm_status: bool = alarm.get("isActive")
            if alarm_status == True:
                activeAlarms.append(alarm)

        return activeAlarms

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
            weekday_indexes = MyLittleHelper.weekday_names_to_indexes(byDay)
            next_alarm_dates = list(rrule(MONTHLY, dtstart=future, count=1, byweekday=weekday_indexes))
        elif isMontly:    # maandelijk/jaarlijks
            next_alarm_dates = list(rrule(YEARLY, dtstart=future, count=1, bymonth=byMonth, bymonthday=byMonthDay))
        else:
            raise GraphQLError(f"Niet ondersteunde combinatie van alarm herhaal instructies. isWeekly:{isWeekly} isMonthly:{isMontly} byDay:{byDay} byMonth:{byMonth} byMonthDay:{byMonthDay}")

        next_alarm_date: date = next_alarm_dates[0].date()

        return next_alarm_date

    def shouldCreateSignaal(alarm: Alarm, transacties) -> Signal:
        datum_margin = int(alarm.get("datumMargin"))
        str_expect_date = alarm.get("datum")
        expect_date = dateutil.parser.isoparse(str_expect_date).date()
        left_date_window = expect_date - timedelta(days=datum_margin)
        right_date_window = (datetime.now(timezone.utc)).date()

        # Evaluate Alarm
        transaction_in_scope = []
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

        if len(transaction_in_scope) <= 0:
            alarm_id = alarm.get("id")
            newSignal = {
                "alarmId": alarm_id,
                "isActive": True,
                "type": "default"
                # "context": None
            }
            signaal_response = requests.post(f"{settings.SIGNALENSERVICE_URL}/signals/", json=newSignal, headers={"Content-type": "application/json"})
            if signaal_response.status_code != 201:
                raise GraphQLError(f"Fout bij het aanmaken van het signaal. {signaal_response.json()}")
            newSignal = signaal_response.json()["data"]

            newSignalId = newSignal.get("id")
            alarm["signaalId"] = newSignalId
            alarm_response = requests.put(f"{settings.ALARMENSERVICE_URL}/alarms/{alarm_id}", json=alarm, headers={"Content-type": "application/json"})
            if alarm_response.status_code != 200:
                raise GraphQLError(f"Fout bij het update van het alarm met het signaal. {alarm_response.json()}")
            alarm = alarm_response.json()["data"]

            return newSignal
        else:
            return None

class MyLittleHelper:

    @staticmethod
    def weekday_names_to_indexes(weekday_names) -> list:
        indexes = []
        for weekday_name in weekday_names:
            index = MyLittleHelper.weekday_name_to_index(weekday_name)
            indexes.append(index)
        return indexes

    @staticmethod
    def weekday_name_to_index(weekday_name: str) -> int:
        weekday_collection = list(calendar.day_name)
        for index, weekday in enumerate(weekday_collection):
            if weekday == weekday_name:
                return index
        return 0 # monday
