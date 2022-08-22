import calendar
from datetime import date, datetime, timezone, timedelta

import graphene
import requests
from dateutil.rrule import rrule, MONTHLY, YEARLY
from flask import request
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.scalars.bedrag import Bedrag
from hhb_backend.graphql.scalars.day_of_week import DayOfWeek
from hhb_backend.graphql.utils.dates import valid_afspraak, to_date
from hhb_backend.graphql.utils.gebruikersactiviteiten import log_gebruikers_activiteit, gebruikers_activiteit_entities


class CreateAlarmInput(graphene.InputObjectType):
    isActive = graphene.Boolean()
    afspraakId = graphene.Int()
    startDate = graphene.String()
    endDate = graphene.String()
    datumMargin = graphene.Int()
    bedrag = graphene.Field(Bedrag)
    bedragMargin = graphene.Field(Bedrag)
    byDay = graphene.List(DayOfWeek, default_value=[])
    byMonth = graphene.List(graphene.Int, default_value=[])
    byMonthDay = graphene.List(graphene.Int, default_value=[])

class UpdateAlarmInput(graphene.InputObjectType):
    isActive = graphene.Boolean()
    afspraakId = graphene.Int()
    startDate = graphene.String()
    endDate = graphene.String()
    datumMargin = graphene.Int()
    bedrag = graphene.Field(Bedrag)
    bedragMargin = graphene.Field(Bedrag)
    byDay = graphene.List(DayOfWeek)
    byMonth = graphene.List(graphene.Int)
    byMonthDay = graphene.List(graphene.Int)


class AlarmHelper:

    def __init__(self, alarm, previous, ok) -> None:
        self.alarm = alarm
        self.previous = previous
        self.ok = ok

    def gebruikers_activiteit(self, _root, _info, *_args, **_kwargs):
        data = dict(
            action=_info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="alarm", result=self, key="alarm"
            ),
            before=dict(alarm=self.previous),
            after=dict(alarm=self.alarm),
        )
        i = _info.field_name.find("-")
        _info.field_name = _info.field_name[:i].strip()
        return data

    @log_gebruikers_activiteit
    async def create(_root, info, input: CreateAlarmInput):

        # alarm_date = parser.parse(input.startDate).date()
        # utc_now = date.today()
        # if alarm_date < utc_now:
        #     raise GraphQLError(f"De alarmdatum moet in de toekomst liggen.")

        if "endDate" in input:
            if input.startDate:
                raise GraphQLError("Het is niet mogelijk om een startDate mee te geven voor een herhalend alarm")
            # can't use attributes to set data
            input["startDate"] = generate_alarm_date(input).isoformat()
        else:
            input["endDate"] = ""

        if (input.byMonth or input.byMonthDay) and not (input.byMonth and input.byMonthDay):
            raise GraphQLError("Vul zowel byMonth als byMonthDay in, of geen van beide.")

        return AlarmHelper._create_alarm(info, input)

    @log_gebruikers_activiteit
    async def create_alarm(_root, info, input):
        return AlarmHelper._create_alarm(info, input)

    @staticmethod
    def _create_alarm(info, input):
        name = info.field_name
        if "evaluate" in name:
            name += " - createAlarm"
            info.field_name = name

        afspraakId = input["afspraakId"]
        afspraak_response = requests.get(f"{settings.HHB_SERVICES_URL}/afspraken/{afspraakId}", headers={"Content-type": "application/json"})
        if afspraak_response.status_code != 200:
            raise GraphQLError("Afspraak bestaat niet.")
        afspraak = afspraak_response.json()["data"]

        # check if afspraak is valid
        if afspraak.get("burger_id") is None:
            raise GraphQLError("De afspraak is niet gekoppeld aan een burger.")

        start_date_alarm = to_date(input["startDate"])
        if not valid_afspraak(afspraak, start_date_alarm):
            raise GraphQLError("De afspraak is niet actief.")

        create_alarm_response = requests.post(f"{settings.ALARMENSERVICE_URL}/alarms/", json=input, headers={"Content-type": "application/json"})
        if create_alarm_response.status_code != 201:
            raise GraphQLError("Aanmaken van het alarm is niet gelukt.")
        response_alarm = create_alarm_response.json()["data"]

        update_afspraak = ({"alarm_id": response_alarm.get("id")})
        update_afspraak_response = requests.post(f"{settings.HHB_SERVICES_URL}/afspraken/{afspraakId}", json=update_afspraak, headers={"Content-type": "application/json"})
        if update_afspraak_response.status_code != 200:
            raise GraphQLError(f"Updaten van afspraak met het nieuwe alarm is niet gelukt. Error message: {update_afspraak_response.json}")

        return AlarmHelper(alarm=response_alarm, previous=dict(), ok=True)

    @log_gebruikers_activiteit
    async def delete(_root, _info, id):
        name = _info.field_name
        if "evaluate" in name:
                name += " - deleteAlarm"
                _info.field_name = name

        previous = await request.dataloader.alarmen_by_id.load(id)
        if not previous:
            raise GraphQLError(f"Alarm with id {id} not found")

        response = requests.delete(f"{settings.ALARMENSERVICE_URL}/alarms/{id}")
        if response.status_code != 204:
            raise GraphQLError(f"Upstream API responded: {response.json()}")

        return AlarmHelper(alarm=dict(), previous=previous, ok=True)


    @log_gebruikers_activiteit
    async def update(_root, _info, id: str, input: UpdateAlarmInput):
        name = _info.field_name
        if "evaluate" in name:
                name += " - updateAlarm"
                _info.field_name = name

        if input.get("startDate"):
            if date_in_past(input.startDate):
                raise GraphQLError(f"Alarm start datum is in het verleden.")

        if input.get("endDate"):
            if date_in_past(input.endDate):
                raise GraphQLError(f"Alarm eind datum is in het verleden.")

        # previous = request.dataloader.alarmen_by_id.load(id) # stalls and waits forever if alarm does not exist
        previous_response = requests.get(f"{settings.ALARMENSERVICE_URL}/alarms/{id}", headers={"Content-type": "application/json"}) 
        if previous_response.status_code != 200:
            raise GraphQLError(f"Alarm bestaat niet.")
        previous = previous_response.json()["data"]

        if input.afspraakId:
            afspraak_response = requests.get(f"{settings.HHB_SERVICES_URL}/afspraken/{input.afspraakId}", headers={"Content-type": "application/json"})
            if afspraak_response.status_code != 200:
                raise GraphQLError(f"Afspraak bestaat niet.")

        response = requests.put(f"{settings.ALARMENSERVICE_URL}/alarms/{id}", json=input, headers={"Content-type": "application/json"}) 
        if response.status_code != 200:
            raise GraphQLError(f"Upstream API responded: {response.json()}")
        response_alarm = response.json()['data']

        return AlarmHelper(alarm=response_alarm, previous=previous, ok=True)


def date_in_past(date_input):
    d = to_date(date_input)
    return d and d < date.today()


# get ByDay, ByMonth and ByMonthDay from alarm
def generate_alarm_date(alarm, alarm_date: date = None) -> date:
    # Create next Alarm in the sequence based on byDay, byMonth, byMonthDay cycle
    by_day = alarm.get("byDay", [])
    by_month = alarm.get("byMonth", [])
    by_month_day = alarm.get("byMonthDay", [])

    # the next alarm date shouldn't be before tomorrow
    tomorrow_utc = (datetime.now(timezone.utc) + timedelta(days=1)).date()
    future = max(alarm_date + timedelta(days=1), tomorrow_utc) if alarm_date else tomorrow_utc

    # https://dateutil.readthedocs.io/en/latest/examples.html#rrule-examples
    is_weekly = by_day and not by_month and not by_month_day
    is_monthly = not by_day and by_month and by_month_day
    if is_weekly:  # weekly
        weekday_indexes = WeekdayHelper.weekday_names_to_indexes(by_day)
        next_alarm_dates = list(rrule(MONTHLY, dtstart=future, count=1, byweekday=weekday_indexes))
    elif is_monthly:  # maandelijk/jaarlijks
        next_alarm_dates = list(rrule(YEARLY, dtstart=future, count=1, bymonth=by_month, bymonthday=by_month_day))
    else:
        raise GraphQLError(
            f"Niet ondersteunde combinatie van alarm herhaal instructies. "
            f"isWeekly:{is_weekly} isMonthly:{is_monthly} byDay:{by_day} byMonth:{by_month} byMonthDay:{by_month_day}"
        )

    return next_alarm_dates[0].date()


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
        return 0  # monday
