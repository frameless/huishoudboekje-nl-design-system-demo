from datetime import date, datetime

from hhb_backend.service.model.afspraak import Afspraak


def to_date(date_str: str | date | datetime = None) -> date:
    """Convenient function for deriving a datetime.date from a string with iso format"""
    type_ = type(date_str)    
    if type_ == str:
        return datetime.fromisoformat(date_str).date()
    elif type_ == date:
        return date_str
    elif type_ == datetime:
        return date_str.date()
    else:
        return None


def valid_afspraak(afspraak: Afspraak, check_date=date.today()):
    """Check if an afspraak is valid on a specified date.

    - If the valid_from date is in the future from today, the afspraak is not valid.
    - If the check_date is before the valid_from date, the afspraak is not valid.
    - If the valid_through date exists and is before the check_date, the afspraak is not valid.
    - Otherwise the afspraak is valid.

    Parameters
    ----------
    afspraak : Afspraak
        The afspraak that will be checked
    check_date : date
        The date to use for the check, default = today

    Returns
    -------
    bool
        If the afspraak is valid or not on the check_date
    """

    if afspraak.valid_from:
        valid_from = to_date(afspraak.valid_from)
        today = date.today()
        if valid_from > today or check_date < valid_from:
            return False

    if afspraak.valid_through:
        valid_through = to_date(afspraak.valid_through)
        if valid_through < check_date:
            return False
            
    return True


def afspraken_intersect(
    valid_from1: date, valid_from2: date, valid_through1: date = None, valid_through2: date = None
) -> bool:
    """
    Checks whether whether two date ranges intersect (= touch or overlap) with each other.
    See also: https://stackoverflow.com/questions/325933/determine-whether-two-date-ranges-overlap#answer-325964
    To be able to treat None values, a little bit of extra logic was needed.
    """
    if not valid_through1:
        if not valid_through2:
            return True
        return False if valid_from1 > valid_through2 else True

    elif not valid_through2:
        return False if valid_from2 > valid_through1 else True

    else:
        latest_start = max(valid_from1, valid_from2)
        earliest_end = min(valid_through1, valid_through2)
        return latest_start <= earliest_end
