from enum import Enum

from sqlalchemy.sql import operators
from sqlalchemy import sql


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


class ListAppearanceOperator(EnumWithGet):
    IN = "in_"
    NOTIN = "notin_"


# TODO: find out why Enum version of this returns errors, then replace for Enum as well
AND_OR_OPERATORS = {
    "AND": sql.and_,
    "OR": sql.or_,
}
