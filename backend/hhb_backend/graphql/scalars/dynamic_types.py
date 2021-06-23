from datetime import date, datetime
from dateutil.parser import parse

from graphene.types import Scalar


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
        try:
            # Try to catch ints first to prevent int strings erroneously parsing to dates
            # (e.g. parse('700') will not fail but return datetime.datetime(700, 6, 18, 0, 0))
            # Note that this does also prevent date formats like 20210101 to be parsed as int instead of date!
            num = int(value)
            if MIN_INT <= num <= MAX_INT:
                return num
        except:
            try:
                return parse(value).isoformat()
            except:
                return value
