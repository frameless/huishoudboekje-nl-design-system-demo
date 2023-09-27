from datetime import datetime

from graphql import GraphQLError


def before_today(datestring: str):
    try:
        if datetime.strptime(datestring, "%Y-%m-%d").date() > datetime.today().date():
            raise GraphQLError("Invalid input")
    except:
        raise GraphQLError("Invalid input")
