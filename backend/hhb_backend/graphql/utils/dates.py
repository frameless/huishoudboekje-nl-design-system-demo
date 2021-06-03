from datetime import date, datetime, timedelta
from typing import Dict


def to_date(date_str) -> date:
    """Convenient function for deriving a datetime.date from a string"""
    return datetime.strptime(date_str, "%Y-%m-%d").date()


def afspraken_intersect(afspraak1: Dict[str, str], afspraak2: Dict[str, str]) -> bool:
    """
    Checks whether whether date range of given afspraak overlaps with main_afspraak's date range.
    For more info on the technique used, see:
    https://stackoverflow.com/questions/325933/determine-whether-two-date-ranges-overlap#answer-325964
    """
    latest_start = max(to_date(afspraak1["valid_from"]), to_date(afspraak2["valid_from"]))
    # based on the assumption that valid_through will never be higher than future_date
    future_date = date.today() + timedelta(days=10000)
    afspraak_stop = to_date(afspraak1["valid_through"]) if afspraak1["valid_through"] else future_date
    main_afspraak_stop = to_date(afspraak2["valid_through"]) if afspraak2["valid_through"] else future_date

    earliest_end = min(afspraak_stop, main_afspraak_stop)

    return latest_start <= earliest_end
