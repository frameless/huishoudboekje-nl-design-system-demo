import sys
from dataclasses import dataclass
from datetime import date, datetime

import pytest

from hhb_backend.graphql.utils.interval import by_month_list, convert_betaalinstructie_interval, \
    convert_iso_duration_to_schedule_by_day, convert_iso_duration_to_schedule_by_month

parse_isodate = lambda date_str: datetime.strptime(date_str, '%Y-%m-%d')


@dataclass
class MockBetaalinstructie:
    start_date: date = parse_isodate("2021-03-30")
    end_date: date = None
    repeat_count: str = None
    by_month_day: int = None
    by_day: list = None
    by_month: list = None


@pytest.mark.parametrize(["betaalinstructie", "result", "message"], [
    (MockBetaalinstructie(), None, None),
    (MockBetaalinstructie(by_month=[1]), None, "ValueError('by_month must be the same as start_date.month')"),
    (MockBetaalinstructie(by_day=[1]), None, "ValueError('day_of_week must be the same for start_date and by_day[0]')"),
    (MockBetaalinstructie(by_month_day=1), None, "ValueError('by_month_day must be the same as start_date.day')"),
    (MockBetaalinstructie(repeat_count=12), None, "ValueError('repeat_count requires at least one of the by fields')"),
    (MockBetaalinstructie(by_month=[3]), "P1Y0M0W0D", None),
    (MockBetaalinstructie(by_month=[3, 6, 9, 12]), "P0Y3M0W0D", None),
    (MockBetaalinstructie(by_month=[1, 3, 5, 7, 9, 11]), "P0Y2M0W0D", None),
    (MockBetaalinstructie(by_month=[3, 6, 10]), None, "ValueError('months in by_month must be at regular interval')"),
    (MockBetaalinstructie(by_month_day=30), "P0Y1M0W0D", None),
    (MockBetaalinstructie(by_day=['Tuesday']), "P0Y0M1W0D", None),
    (MockBetaalinstructie(by_day=['Tuesday', 'Wednesday']), None, "ValueError('by_day only supports 1 item')"),
])
def test_convert_betaalinstructie_interval(betaalinstructie, result, message):
    try:
        interval = convert_betaalinstructie_interval(betaalinstructie)
        assert message is None
        assert interval == result
    except:
        assert message == repr(sys.exc_info()[1])


@pytest.mark.parametrize(["start", "step", "expected"], [
    (1, 1, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
    (12, 1, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
    (1, 2, [1, 3, 5, 7, 9, 11]),
    (11, 2, [1, 3, 5, 7, 9, 11]),
    (12, 2, [2, 4, 6, 8, 10, 12]),
])
def test_by_month_list(start, step, expected):
    result = by_month_list(start, step)
    assert result == expected


@pytest.mark.parametrize(["iso_format", "start_date", "expected"], [
    ("P1Y0M0W0D", "2021-03-30", None),
    ("P0Y1M0W0D", "2021-03-30", None),
    ("P0Y2M0W0D", "2021-03-30", [1, 3, 5, 7, 9, 11]),
    ("P0Y3M0W0D", "2021-03-30", [3, 6, 9, 12]),
    ("P0Y0M1W0D", "2021-03-30", None),
    ("P0Y0M0W1D", "2021-03-30", None),
])
def test_convert_iso_duration_to_schedule_by_month(iso_format, start_date, expected):
    result = convert_iso_duration_to_schedule_by_month(iso_format, datetime.strptime(start_date, "%Y-%m-%d"))
    assert result == expected

@pytest.mark.parametrize(["iso_format", "start_date", "expected"], [
    ("P1Y0M0W0D", "2021-03-30", None),
    ("P0Y1M0W0D", "2021-03-30", None),
    ("P0Y0M1W0D", "2021-03-30", ['Tuesday']),
    ("P0Y0M2W0D", "2021-03-30", None),
    ("P0Y0M0W1D", "2021-03-30", None),
])
def test_convert_iso_duration_to_schedule_by_day(iso_format, start_date, expected):
    result = convert_iso_duration_to_schedule_by_day(iso_format, datetime.strptime(start_date, "%Y-%m-%d"))
    assert result == expected
