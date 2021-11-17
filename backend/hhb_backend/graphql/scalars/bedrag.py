from decimal import Context, ROUND_HALF_DOWN
import re
from decimal import Decimal

from graphene.types import Scalar
from graphql.language import ast


class Bedrag(Scalar):
    """Bedrag (bijvoorbeeld: 99.99) n"""

    VALID_BEDRAG = re.compile("^\s*\d+\.\d\d$") # any sequence of numbers followed by a `.` and two numbers

    @staticmethod
    def serialize(value):
        return f"{Decimal(value, Context(prec=2, rounding=ROUND_HALF_DOWN)) / 100:.2f}"

    @staticmethod
    def parse_literal(node):
        if isinstance(node, ast.StringValue):
            return Bedrag.parse_value(node.value)

    @staticmethod
    def parse_value(value):
        return int(Decimal(value) * 100)
