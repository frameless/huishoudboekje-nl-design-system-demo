from enum import Enum

from sqlalchemy.sql import operators
from sqlalchemy import sql


class EnumWithGet(Enum):
    @classmethod
    def get(cls, value: str, default=None):
        return next((k for k in list(cls) if k.name == value), default)


class ComparisonOperator(EnumWithGet):
    eq = operators.eq
    neq = operators.ne
    gt = operators.gt
    gte = operators.ge
    lt = operators.lt
    lte = operators.le


class ListAppearanceOperator(EnumWithGet):
    in_ = "in_"
    notin_ = "notin_"


# TODO: find out why Enum version of this returns errors, then replace for Enum as well
AND_OR_OPERATORS = {
    "and_": sql.and_,
    "or_": sql.or_,
}
