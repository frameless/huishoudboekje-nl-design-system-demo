""" Utility functions """
import datetime
import json
import logging
from datetime import date

from flask import make_response
from sqlalchemy.exc import OperationalError
from sqlalchemy import inspect
from werkzeug.exceptions import abort


def row2dict(result):
    if hasattr(result, "keys"):
        columns = result.keys()
    else:
        columns = inspect(result).mapper.columns.keys()
    new_result = {}
    for c in columns:
        data = getattr(result, c)
        if isinstance(data, date):
            new_result[c] = data.isoformat()
        else:
            new_result[c] = data
    return new_result


def handle_operational_error(error: OperationalError):
    logging.exception("Could not connect to the database")
    logging.debug(error)
    abort(make_response(
        {"errors": ["Could not connect to the database"]}, 500))


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


def valid_date_range(startDate, endDate):
    '''Checks if both dates in the range are valid and that the end date is after start date'''
    try:
        return string_to_date(endDate) > string_to_date(startDate)
    except:
        return False


def valid_date(date):
    try:
        return string_to_date(date)
    except:
        return False


def string_to_date(date):
    dateformat = '%Y-%m-%d'
    return datetime.datetime.strptime(date, dateformat)
