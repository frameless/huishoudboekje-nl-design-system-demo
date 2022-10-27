import calendar
import graphene
import logging
import requests
from datetime import date, datetime, timezone, timedelta
from dateutil.rrule import rrule, MONTHLY, YEARLY
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.scalars.bedrag import Bedrag
from hhb_backend.graphql.scalars.day_of_week import DayOfWeek
from hhb_backend.graphql.utils.dates import valid_afspraak, to_date
from hhb_backend.graphql.utils.dates import valid_afspraak, to_date
from hhb_backend.graphql.utils.upstream_error_handler import UpstreamError


class CreateAlarmInput(graphene.InputObjectType):
    isActive = graphene.Boolean()
    afspraakId = graphene.Int()
    startDate = graphene.String()
    endDate = graphene.String(default_value="")
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

    def __init__(self, alarm, previous, ok, burger_id) -> None:
        self.alarm = alarm
        self.previous = previous
        self.ok = ok
        self.burger_id = burger_id

    @staticmethod
    async def create(input):
        logging.info(f"AlarmHelper.create: creating alarm... Input: {input}")

        # TODO eventually turn this back on, for testing purposes it is off
        # alarm_date = parser.parse(input.startDate).date()
        # utc_now = date.today()
        # if alarm_date < utc_now:
        #     raise GraphQLError(f"The alarm date has to be in the future.")

        if (input["byMonth"] or input["byMonthDay"]) and not (input["byMonth"] and input["byMonthDay"]):
            raise GraphQLError("Either both byMonth and byMonthDay are required, or neither.")

        if not input["endDate"]:
            if input.get("startDate"):
                raise GraphQLError("It is not possible to have a startDate for a repetitive alarm.")
            # can't use attributes to set data
            input["startDate"] = generate_alarm_date(input).isoformat()

        afspraak_id = input["afspraakId"]
        afspraak = hhb_dataloader().afspraken.load_one(afspraak_id)
        if not afspraak:
            raise GraphQLError(f"Afspraak not found.")

        start_date_alarm = to_date(input["startDate"])
        if not valid_afspraak(afspraak, start_date_alarm):
            raise GraphQLError("The afspraak is not active.")

        create_alarm_response = requests.post(f"{settings.ALARMENSERVICE_URL}/alarms/", json=input,
                                              headers={"Content-type": "application/json"})
        if create_alarm_response.status_code != 201:
            raise UpstreamError(create_alarm_response, "Failed to create alarm.")
        response_alarm = create_alarm_response.json()["data"]

        update_afspraak = ({"alarm_id": response_alarm.get("id")})
        update_afspraak_response = requests.post(f"{settings.HHB_SERVICES_URL}/afspraken/{afspraak_id}",
                                                 json=update_afspraak, headers={"Content-type": "application/json"})
        if update_afspraak_response.status_code != 200:
            raise UpstreamError(update_afspraak_response, "Failed to update afspraak with new alarm.")

        logging.info(f"AlarmHelper.create: created alarm. Response: {response_alarm}")
        return AlarmHelper(alarm=response_alarm, previous=dict(), ok=True, burger_id=afspraak.burger_id)

    @staticmethod
    async def delete(id):
        logging.info(f"AlarmHelper.delete: deleting alarm... Id: {id}")

        previous = hhb_dataloader().alarms.load_one(id)
        if not previous:
            raise GraphQLError(f"Alarm with id {id} not found")

        afspraak_id = previous.afspraakId
        afspraak = hhb_dataloader().afspraken.load_one(afspraak_id)
        burger_id = ""
        if afspraak:
            if afspraak.burger_id:
                burger_id = afspraak.burger_id

        response = requests.delete(f"{settings.ALARMENSERVICE_URL}/alarms/{id}")
        if response.status_code != 204:
            raise UpstreamError(response, "Could not delete the alarm.")

        logging.info(f"AlarmHelper.delete: deleted alarm. Id: {id}.")
        return AlarmHelper(alarm=dict(), previous=previous, ok=True, burger_id=burger_id)

    @staticmethod
    async def update(id: str, input: UpdateAlarmInput):
        logging.info(f"AlarmHelper.update: updating alarm... Id: {id}, input: {input}")

        # TODO eventually turn this back on, for testing purposes it is off
        # if input.get("startDate"):
        #     if date_in_past(input.startDate):
        #         raise GraphQLError("Alarm start date has to be in the future.")

        if input.get("endDate"):
            if date_in_past(input.endDate):
                raise GraphQLError("Alarm end date has to be in the future.")

        previous_response = hhb_dataloader().alarms.load_one(id)
        if not previous_response:
            raise GraphQLError("Alarm not found.")

        if input.afspraakId:
            afspraak_response = hhb_dataloader().afspraken.load_one(input.afspraakId)
            if not afspraak_response:
                raise GraphQLError("Afspraak not found.")
        elif previous_response.afspraakId:
            afspraak_response = hhb_dataloader().afspraken.load_one(previous_response.afspraakId)

        response = requests.put(f"{settings.ALARMENSERVICE_URL}/alarms/{id}", json=input,
                                headers={"Content-type": "application/json"})
        if response.status_code != 200:
            raise UpstreamError(response, "Updating alarm failed.")
        response_alarm = response.json()['data']

        logging.info(f"AlarmHelper.update: updated alarm {id}. Response: {response_alarm}.")
        return AlarmHelper(alarm=response_alarm, previous=previous_response, ok=True,
                           burger_id=afspraak_response.burger_id)


def date_in_past(date_input):
    d = to_date(date_input)
    return d and d < date.today()


# get ByDay, ByMonth and ByMonthDay from alarm
def generate_alarm_date(alarm, alarm_date: date = None) -> date:
    # Create next Alarm in the sequence based on byDay, byMonth, byMonthDay cycle
    by_day = alarm.get("byDay", [])
    by_month = alarm.get("byMonth", [])
    by_month_day = alarm.get("byMonthDay", [])

    # the next alarm date from today
    today = date.today()
    future = max(alarm_date, today) if alarm_date else today

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
            f"This combination of intructions is not supported. "
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
