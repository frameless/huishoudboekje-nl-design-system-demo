from datetime import date, datetime


def to_date(date_str: str = None) -> date:
    """Convenient function for deriving a datetime.date from a string"""
    return datetime.strptime(date_str, "%Y-%m-%d").date() if date_str else None


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
