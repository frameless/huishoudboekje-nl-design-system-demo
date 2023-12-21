import calendar
import logging
from datetime import date, datetime

import graphene
import requests
from dateutil.rrule import rrule, MONTHLY, YEARLY

from graphql import GraphQLError
from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.scalars.bedrag import Bedrag
from hhb_backend.graphql.scalars.day_of_week import DayOfWeekEnum
from hhb_backend.graphql.utils.dates import valid_afspraak, to_date
from hhb_backend.graphql.utils.upstream_error_handler import UpstreamError
from hhb_backend.graphql.mutations.json_input_validator import JsonInputValidator


class CreateAlarmInput(graphene.InputObjectType):
    isActive = graphene.Boolean()
    afspraakId = graphene.Int()
    startDate = graphene.String()
    endDate = graphene.String(default_value="")
    datumMargin = graphene.Int()
    bedrag = graphene.Argument(Bedrag)
    bedragMargin = graphene.Argument(Bedrag)
    byDay = graphene.List(DayOfWeekEnum, default_value=[])
    byMonth = graphene.List(graphene.Int, default_value=[])
    byMonthDay = graphene.List(graphene.Int, default_value=[])


class UpdateAlarmInput(graphene.InputObjectType):
    isActive = graphene.Boolean()
    afspraakId = graphene.Int()
    startDate = graphene.String()
    endDate = graphene.String()
    datumMargin = graphene.Int()
    bedrag = graphene.Argument(Bedrag)
    bedragMargin = graphene.Argument(Bedrag)
    byDay = graphene.List(DayOfWeekEnum)
    byMonth = graphene.List(graphene.Int)
    byMonthDay = graphene.List(graphene.Int)


class AlarmHelper:

    def __init__(self, alarm, previous, ok, burger_id) -> None:
        self.alarm = alarm
        self.previous = previous
        self.ok = ok
        self.burger_id = burger_id

    @staticmethod
    def create(input):
        logging.debug(f"AlarmHelper.create: creating alarm... Input: {input}")
        validate_input(input)
        # TODO eventually turn this back on, for testing purposes it is off
        # alarm_date = parser.parse(input.startDate).date()
        # utc_now = date.today()
        # if alarm_date < utc_now:
        #     raise GraphQLError(f"The alarm date has to be in the future.")

        if (input.get("byMonth", None) or input.get("byMonthDay", None)) and not (input.get("byMonth", None) and input.get("byMonthDay", None)):
            raise GraphQLError(
                "Either both byMonth and byMonthDay are required, or neither.")

        afspraak_id = input["afspraakId"]
        afspraak = hhb_dataloader().afspraken.load_one(afspraak_id)
        if not afspraak:
            raise GraphQLError(f"Afspraak not found.")

        if not input.get("endDate"):
            if input.get("startDate"):
                startDate = to_date(input["startDate"])
                if startDate >= to_date(afspraak.valid_from):
                    input["startDate"] = generate_alarm_date(
                        input, start_date=startDate).isoformat()
                else:
                    raise GraphQLError(
                        "De startdatum van het alarm kan niet voor de startatum van de afspraak zijn.")
            else:
                input["startDate"] = generate_alarm_date(input).isoformat()

        start_date_alarm = to_date(input["startDate"])
        if not valid_afspraak(afspraak, start_date_alarm, future_afspraak_allowed=True):
            raise GraphQLError("The afspraak is not active.")

        create_alarm_response = requests.post(f"{settings.ALARMENSERVICE_URL}/alarms/", json=input,
                                              headers={"Content-type": "application/json"})
        if create_alarm_response.status_code != 201:
            raise UpstreamError(create_alarm_response,
                                "Failed to create alarm.")
        response_alarm = create_alarm_response.json()["data"]

        update_afspraak = ({"alarm_id": response_alarm.get("id")})
        update_afspraak_response = requests.post(f"{settings.HHB_SERVICES_URL}/afspraken/{afspraak_id}",
                                                 json=update_afspraak, headers={"Content-type": "application/json"})
        if update_afspraak_response.status_code != 200:
            raise UpstreamError(update_afspraak_response,
                                "Failed to update afspraak with new alarm.")
        logging.debug(
            f"AlarmHelper.create: created alarm. Response: {response_alarm}")
        return AlarmHelper(alarm=response_alarm, previous=dict(), ok=True, burger_id=afspraak.burger_id)

    @staticmethod
    def delete(id):
        logging.debug(f"AlarmHelper.delete: deleting alarm... Id: {id}")

        previous = hhb_dataloader().alarms.load_one(id)
        if not previous:
            raise GraphQLError(f"Alarm with id {id} not found")

        afspraak_id = previous.afspraakId
        afspraak = hhb_dataloader().afspraken.load_one(afspraak_id)
        burger_id = ""
        if afspraak:
            if afspraak.burger_id:
                burger_id = afspraak.burger_id

        response = requests.delete(
            f"{settings.ALARMENSERVICE_URL}/alarms/{id}")
        if response.status_code != 204:
            raise UpstreamError(response, "Could not delete the alarm.")
        logging.debug(f"AlarmHelper.delete: deleted alarm. Id: {id}.")
        return AlarmHelper(alarm=dict(), previous=previous, ok=True, burger_id=burger_id)

    @staticmethod
    def update(id: str, input: UpdateAlarmInput):
        logging.debug(
            f"AlarmHelper.update: updating alarm... Id: {id}, input: {input}")
        validate_input(input)

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
            afspraak_response = hhb_dataloader().afspraken.load_one(
                previous_response.afspraakId)

        response = requests.put(f"{settings.ALARMENSERVICE_URL}/alarms/{id}", json=input,
                                headers={"Content-type": "application/json"})
        if response.status_code != 200:
            raise UpstreamError(response, "Updating alarm failed.")
        response_alarm = response.json()['data']

        logging.debug(
            f"AlarmHelper.update: updated alarm {id}. Response: {response_alarm}.")
        return AlarmHelper(alarm=response_alarm, previous=previous_response, ok=True,
                           burger_id=afspraak_response.burger_id)


def validate_input(input):
    validation_schema = {
        "type": "object",
        "properties": {
                "isActive": {"type": "boolean"},
                "startDate": {"type": "string", "format": "date"},
                "endDate": {"oneOf": [
                    {"type": "string", "format": "date"},
                    {"type": "null"}
                ]},
            "datum_margin": {"type": "integer", "minimum": 0},
            "bedrag": {"type": "integer", "minimum": 0},
            "bedragMargin": {"type": "integer", "minimum": 0},
            "byDay": {"type": "array", "prefixItems": [{"type": "string"}, {"enum": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]}]},
            "byMonth": {"type": "array",  "items": {"type": "integer", "minimum": 1, "maximum": 12}},
            "byMonthDay": {"type": "array", "items": {"type": "integer", "minimum": 1, "maximum": 31}}
        }
    }

    JsonInputValidator(validation_schema).validate(input)
    if (not input.get("endDate", None) == "" or not input.get("endDate", None)) and input.get("byMonthDay", None):
        if any(day > 28 for day in input.get("byMonthDay")):
            raise GraphQLError("Invalid input")


def date_in_past(date_input):
    d = to_date(date_input)
    return d and d < date.today()


# get ByDay, ByMonth and ByMonthDay from alarm
def generate_alarm_date(alarm, start_date: date = None, alarm_date: date = None) -> date:
    # Create next Alarm in the sequence based on byDay, byMonth, byMonthDay cycle
    by_day = alarm.get("byDay", [])
    by_month = alarm.get("byMonth", [])
    by_month_day = alarm.get("byMonthDay", [])

    # the next alarm date from start_date
    if not start_date:
        start_date = date.today()
    future = max(alarm_date, start_date) if alarm_date else start_date

    # https://dateutil.readthedocs.io/en/latest/examples.html#rrule-examples
    is_weekly = by_day and not by_month and not by_month_day
    is_monthly = not by_day and by_month and by_month_day
    if is_weekly:  # weekly
        weekday_indexes = WeekdayHelper.weekday_names_to_indexes(by_day)
        next_alarm_dates = list(
            rrule(MONTHLY, dtstart=future, count=1, byweekday=weekday_indexes))
    elif is_monthly:  # maandelijk/jaarlijks
        next_alarm_dates = list(rrule(
            YEARLY, dtstart=future, count=1, bymonth=by_month, bymonthday=by_month_day))
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
