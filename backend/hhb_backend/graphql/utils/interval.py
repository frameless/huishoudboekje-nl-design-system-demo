import calendar
import re
from datetime import date

from dateutil.relativedelta import relativedelta


def convert_betaalinstructie_interval(betaalinstructie):
    month_day = betaalinstructie.by_month_day
    by_month = betaalinstructie.by_month
    start_date = betaalinstructie.start_date
    by_day = betaalinstructie.by_day

    if betaalinstructie.repeat_count and betaalinstructie.repeat_count > 1:
        if by_month is None and by_day is None and month_day is None:
            raise ValueError('repeat_count requires at least one of the by fields')
    if month_day:
        if month_day != start_date.day:
            raise ValueError("by_month_day must be the same as start_date.day")
        if not by_month:
            return "P0Y1M0W0D"

    if by_month and len(by_month) > 0:
        if len(by_month) == 1:
            if by_month[0] != start_date.month:
                raise ValueError("by_month must be the same as start_date.month")
            return "P1Y0M0W0D"
        else:
            step = by_month[1] - by_month[0]
            if by_month_list(by_month[0], step) != by_month:
                raise ValueError("months in by_month must be at regular interval")
            return f"P0Y{step}M0W0D"

    if by_day and len(by_day) > 0:
        if len(by_day) > 1:  # TODO remove when the huishoudboekje service is updated
            raise ValueError("by_day only supports 1 item")
        if _day_of_week(start_date) != by_day[0]:
            raise ValueError("day_of_week must be the same for start_date and by_day[0]")
        return "P0Y0M1W0D"

    return None


DURATION_PATTERN = re.compile(r'P(\d+)Y(\d+)M(\d+)W(\d+)D')


def convert_iso_duration_to_schedule_by_month(iso_format: str, start_date: date):
    if iso_format:
        if p := DURATION_PATTERN.findall(iso_format):
            month_interval = int(p[0][1])
            if month_interval > 1:
                return by_month_list(start_date.month, month_interval)
    return None


def by_month_list(start, step):
    return sorted([m % 12 + 1 for m in range(start - 1, start - 1 + 12, step)])


def convert_iso_duration_to_schedule_by_day(iso_format: str, start_date: date):
    if iso_format:
        if p := DURATION_PATTERN.findall(iso_format):
            week_interval = int(p[0][2])
            if week_interval == 1:
                return [_day_of_week(start_date)]
    return None


def _day_of_week(a_date: date):
    return calendar.day_name[a_date.weekday()]


def convert_hhb_interval_to_dict(iso_format: str):
    if iso_format:
        p = re.compile(r'P(\d+)Y(\d+)M(\d+)W(\d+)D').findall(iso_format)
        if p:
            return {
                "jaren": int(p[0][0]),
                "maanden": int(p[0][1]),
                "weken": int(p[0][2]),
                "dagen": int(p[0][3])
            }
    return {"jaren": 0, "maanden": 0, "weken": 0, "dagen": 0}


def convert_hhb_interval_to_relativetime(iso_format: str):
    if iso_format:
        p = re.compile(r'P(\d+)Y(\d+)M(\d+)W(\d+)D').findall(iso_format)
        if p:
            return relativedelta(
                years=int(p[0][0]),
                months=int(p[0][1]),
                weeks=int(p[0][2]),
                days=int(p[0][3])
            )
    return relativedelta(days=0)
