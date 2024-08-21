from datetime import datetime

from graphql import GraphQLError


def before_today(datestring: str):
    try:
        if datetime.strptime(datestring, "%Y-%m-%d").date() > datetime.today().date():
            raise GraphQLError("Invalid input")
    except:
        raise GraphQLError("Invalid input")

def after_or_today(datestring: str):
    try:
        if datetime.strptime(datestring, "%Y-%m-%d").date() < datetime.today().date():
            raise GraphQLError("Invalid input")
    except:
        raise GraphQLError("Invalid input")


def correct_date(datestring: str):
    try:
        datetime.strptime(datestring, "%Y-%m-%d").date()
    except:
        raise GraphQLError("Invalid input")