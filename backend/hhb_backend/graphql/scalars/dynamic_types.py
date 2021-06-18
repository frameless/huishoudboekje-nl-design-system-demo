from datetime import date, datetime

from aniso8601 import parse_date, parse_datetime
from graphene.types import Scalar
from graphql.language.ast import IntValue


# As per the GraphQL Spec, Integers are only treated as valid when a valid
# 32-bit signed integer, providing the broadest support across platforms.
#
# n.b. JavaScript's integers are safe between -(2^53 - 1) and 2^53 - 1 because
# they are internally represented as IEEE 754 doubles.


MAX_INT = 2147483647
MIN_INT = -2147483648


class DynamicType(Scalar):
    """
    Accepts dates, datetimes, ints and strings.
    """

    @staticmethod
    def serialize(value):
        if isinstance(value, (datetime, date)):
            return value.isoformat()
        else:
            try:
                num = int(value)
            except ValueError:
                try:
                    num = int(float(value))
                except ValueError:
                    return value
            if MIN_INT <= num <= MAX_INT:
                return num

    @classmethod
    def parse_literal(cls, node):
        return cls.parse_value(node.value)

    @staticmethod
    def parse_value(value):
        if isinstance(value, date):
            return parse_date(date)
        elif isinstance(value, datetime):
            return parse_datetime(datetime)
        elif isinstance(value, IntValue):
            num = int(value.value)
            if MIN_INT <= num <= MAX_INT:
                return num
        else:
            return value
