""" Utility functions """
import logging
from datetime import date

from flask import make_response
from sqlalchemy.exc import OperationalError
from werkzeug.exceptions import abort


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


def handle_operational_error(error: OperationalError):
    logging.exception(error)
    abort(make_response({"errors": ["Could not connect to the database"]}, 500))


def one_or_none(query):
    try:
        return query.one_or_none()
    except OperationalError as error:
        handle_operational_error(error)


def get_all(query):
    try:
        return query.all()
    except OperationalError as error:
        handle_operational_error(error)
