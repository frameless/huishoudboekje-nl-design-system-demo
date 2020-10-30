""" Utility functions """
from datetime import date

def row2dict(result):
    if hasattr(result, "keys"):
        columns = result.keys()
    else:
        columns = result.__table__.columns.keys()
    new_result = {}
    for c in columns:
        data = getattr(result, c)
        if isinstance(data, date):
            new_result[c] = data.isoformat()
        else:
            new_result[c] = data
    return new_result
