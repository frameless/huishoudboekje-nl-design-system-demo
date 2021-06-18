from enum import Enum

from sqlalchemy.sql import operators


class EnumWithGet(Enum):
    @classmethod
    def get(cls, value: str, default=None):
        return next((k for k in list(cls) if k.name == value), default)


class ComparisonOperator(EnumWithGet):
    EQ = operators.eq
    NEQ = operators.ne
    GT = operators.gt
    GTE = operators.ge
    LT = operators.lt
    LTE = operators.le


class RangeOperator(EnumWithGet):
    BETWEEN = "between"


class ListAppearanceOperator(EnumWithGet):
    IN = "in_"
    NOTIN = "notin_"


class AndOrOperator(EnumWithGet):
    AND = "and_"
    OR = "or_"
