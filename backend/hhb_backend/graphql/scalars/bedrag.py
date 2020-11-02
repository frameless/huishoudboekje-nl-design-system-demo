from graphene.types import Scalar
from graphql.language import ast
from decimal import Decimal
import re

class Bedrag(Scalar):
    '''Decimaal Scalar Description'''

    VALID_BEDRAG = re.compile("^\s*\d+\.\d\d$") # any sequence of numbers followed by a `.` and two numbers

    @staticmethod
    def serialize(value):
        return str(Decimal(value) / 100)

    @staticmethod
    def parse_literal(node):
        if isinstance(node, ast.StringValue):
            return Bedrag.parse_value(node.value)

    @staticmethod
    def parse_value(value):
        return int(Decimal(value) * 100)