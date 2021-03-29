import calendar
import re
from datetime import date

from dateutil.relativedelta import relativedelta


def convert_hhb_interval_to_iso(graphql_format: dict):
    if any(graphql_format.get(k, None) for k in ('jaren', 'maanden', 'weken', 'dagen')):
        isoformat = "P"
        isoformat += f"{graphql_format.get('jaren', 0)}Y"
        isoformat += f"{graphql_format.get('maanden', 0)}M"
        isoformat += f"{graphql_format.get('weken', 0)}W"
        isoformat += f"{graphql_format.get('dagen', 0)}D"
        return isoformat
    return ""


DURATION_PATTERN = re.compile(r'P(\d+)Y(\d+)M(\d+)W(\d+)D')


def convert_iso_duration_to_schedule_by_month(iso_format: str, start_date: date):
    if iso_format:
        if p := DURATION_PATTERN.findall(iso_format):
            month_interval = int(p[0][1])
            if month_interval > 1:
                return by_month(start_date.month, month_interval)
    return None


def by_month(start, step):
    return sorted([m % 12 + 1 for m in range(start - 1, start - 1 + 12, step)])


def convert_iso_duration_to_schedule_by_day(iso_format: str, start_date: date):
    if iso_format:
        if p := DURATION_PATTERN.findall(iso_format):
            week_interval = int(p[0][2])
            if week_interval == 1:
                return [calendar.day_name[start_date.weekday()]]
    return None


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
