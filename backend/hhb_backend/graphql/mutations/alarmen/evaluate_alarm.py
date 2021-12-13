""" TODO """

from hhb_backend.graphql.models.Alarm import Alarm
from hhb_backend.graphql.models.afspraak import Afspraak
from hhb_backend.graphql.models.bank_transaction import BankTransaction, Bedrag

import graphene
from hhb_backend.graphql.utils.gebruikersactiviteiten import (log_gebruikers_activiteit, gebruikers_activiteit_entities)
import requests
from graphql import GraphQLError
from hhb_backend.graphql import settings
from datetime import *
from dateutil.rrule import rrule, MONTHLY, YEARLY, WEEKLY
import calendar
from dateutil.relativedelta import *
import dateutil.parser

import json
import logging

class AlarmTriggerResult(graphene.ObjectType):
    alarm = graphene.Field(lambda: Alarm)
    nextAlarmDate = graphene.Date()
    signaalTriggered = graphene.Boolean()

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
        """ TODO """
        triggered_alarms = []
        alarms = EvaluateAlarm.getAlarms()
        for alarm in alarms:
            afspraakId = alarm.get('afspraakId')
            afspraak = EvaluateAlarm.getAfspraakById(afspraakId)

            journaalIds = afspraak.get("journaalposten", [])
            transacties = EvaluateAlarm.getBanktransactiesByJournaalIds(journaalIds)

            nextAlarmDate = EvaluateAlarm.generateNextAlarmInSequence(afspraak)

            createSignaal = EvaluateAlarm.shouldCreateSignaal(alarm, transacties)

            triggered_alarms.append({
                "alarm": alarm,
                "nextAlarmDate": nextAlarmDate,
                "signaalTriggered": createSignaal
            })


        return EvaluateAlarm(alarmTriggerResult=triggered_alarms)

    def getAlarms() -> list:
        alarm_response = requests.get(f"{settings.ALARMENSERVICE_URL}/alarms/", headers={"Content-type": "application/json"})
        if alarm_response.status_code != 200:
            raise GraphQLError(f"Upstream API responded: {alarm_response.json()}")
        alarms = alarm_response.json()["data"]
        # logging.getLogger(f"wouter-logger").warning(f"\n\n alarms: {json.dumps(alarms)} \n")

        return alarms


    def getAfspraakById(afspraakId: int) -> Afspraak:
        afspraak_response = requests.get(f"{settings.HHB_SERVICES_URL}/afspraken/{afspraakId}", headers={"Content-type": "application/json"})
        if afspraak_response.status_code != 200:
            raise GraphQLError(f"Upstream API responded: {afspraak_response.json()}")
        afspraak = afspraak_response.json()['data']
        # logging.getLogger(f"wouter-logger").warning(f"\n\n afspraak: {json.dumps(afspraak)} \n")

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


    def getBanktransactiesByJournaalIds(journaalIds):
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

        logging.getLogger(f"wouter-logger").warning(f"\n\n transacties: {json.dumps(transacties)} \n")
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


    def generateNextAlarmInSequence(afspraak: Afspraak) -> datetime:
        # Create next Alarm in the sequence based on the 'Afspraak'
        betaalinstructie = afspraak.get("betaalinstructie")
        byDay = betaalinstructie.get("by_day")
        byMonth = betaalinstructie.get("by_month")
        byMonthDay = betaalinstructie.get("by_month_day")

        # add one day so it doesnt return the same day
        current_date_utc = (datetime.now(timezone.utc) + timedelta(days=1)).date()
        # https://dateutil.readthedocs.io/en/latest/examples.html#rrule-examples
        if byDay is not None and byMonth is None and byMonthDay is None:        # weekly
            weekday_indexes = MyLittleHelper.weekday_names_to_indexes(byDay)
            # logging.getLogger(f"wouter-logger").warning(f"\n\n names:{byDay} index:{weekday_indexes}  \n")
            next_alarm_dates = list(rrule(MONTHLY, dtstart=current_date_utc, count=1, byweekday=weekday_indexes))
        elif byMonth is not None and byMonthDay is not None and byDay is None:                              # maandelijk/jaarlijks
            # logging.getLogger(f"wouter-logger").warning(f"\n\n afspraak is montly/yearly  \n")
            next_alarm_dates = list(rrule(YEARLY, dtstart=current_date_utc, count=1, bymonth=byMonth, bymonthday=byMonthDay))
        else:
            logging.getLogger(f"wouter-logger").warning(f"-->>>> >>>> Unsupported 'betaalinstructie' \n")
            raise GraphQLError(f"Niet ondersteunde combinatie van betaalinstructies.")

        next_alarm_date: date = next_alarm_dates[0].date()

        return next_alarm_date


    def shouldCreateSignaal(alarm: Alarm, transacties) -> bool:
        # Base check if this Alarm if active, else we dont even need to check
        alarm_status = alarm.get("isActive")
        if alarm_status == True:
            logging.getLogger(f"wouter-logger").warning(f"-->>>> >>>> Alarm is active \n")
        elif alarm_status == False:
            logging.getLogger(f"wouter-logger").warning(f"-->>>> >>>> Alarm is not active \n")
            return False
        else:
            logging.getLogger(f"wouter-logger").warning(f"-->>>> >>>> Alarm status is unknown \n")
            raise GraphQLError(f"Niet ondersteunde waarde voor alarm status.")

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

            # logging.getLogger(f"wouter-logger").warning(f"-->>>> >>>> Look for transaction: {left_date_window} > {transaction_date} < {right_date_window} \n")
            if left_date_window <= transaction_date <= right_date_window:
                # logging.getLogger(f"wouter-logger").warning(f"-->>>> >>>> Found transaction in alarm date margin \n")
                left_monetary_window = expected_alarm_bedrag - monetary_margin
                right_monetary_window = expected_alarm_bedrag + monetary_margin
                # logging.getLogger(f"wouter-logger").warning(f"-->>>> >>>> \n\n {left_monetary_window} <= {actual_transaction_bedrag} <= {right_monetary_window} \n")
                if left_monetary_window <= actual_transaction_bedrag <= right_monetary_window:
                    transaction_in_scope.append(transaction)
                    # logging.getLogger(f"wouter-logger").warning(f"-->>>> >>>> Found transaction within alarm monetary margin \n")
                # else:
                #     logging.getLogger(f"wouter-logger").warning(f"-->>>> >>>> Bedrag was not within alarm margin - creating signaal! \n")
            # else:
            #     logging.getLogger(f"wouter-logger").warning(f"-->>>> >>>> No transaction found in given timeframe - creating signaal! \n")

        if len(transaction_in_scope) <= 0:
            return True
        else:
            return False


class MyLittleHelper:

    @staticmethod
    def find_closest_date(origin_date: datetime, weekdays) -> datetime: # weekdays => is a 'list' of 'str' > being weekdays eg Monday, Friday
        date_options = []
        for index, str_weekday in enumerate(weekdays):
            next_date_for_weekday = MyLittleHelper.next_date_for_weekday(origin_date, str_weekday)
            date_options.append(next_date_for_weekday)
        first_date = min(date_options)
        return first_date

    @staticmethod
    def next_date_for_weekday(origin_date: datetime, str_weekday: str) -> datetime:
        weekday_index = MyLittleHelper.weekday_name_to_index(str_weekday)
        next_date_for_weekday = MyLittleHelper.next_weekday(origin_date, weekday_index)
        return next_date_for_weekday

    # weekday => 0 = Monday, 1=Tuesday, 2=Wednesday
    @staticmethod
    def next_weekday(origin_date: datetime, weekday: int) -> datetime:
        current_day_of_week = MyLittleHelper.get_weekday(origin_date)
        days_ahead = weekday - origin_date.weekday()
        if days_ahead <= 0: # Target day already happened this week
            days_ahead += 7
        next_date_same_weekday = origin_date + timedelta(days_ahead)
        return next_date_same_weekday

    @staticmethod
    def get_weekday(datetime: datetime) -> str:
        return datetime.strftime("%A")

    @staticmethod
    def int_to_weekday(weekday_index: int) -> str:
        weekday_collection = list(calendar.day_name)
        return weekday_collection[weekday_index]

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
        # logging.getLogger(f"wouter-logger").warning(f"\n\n weekday_collection:{weekday_collection}  \n")
        for index, weekday in enumerate(weekday_collection):
            if weekday == weekday_name:
                return index
        return 0 # monday
