from sqlalchemy.sql import operators, and_, or_


COMPARISON_OPERATORS = {
    "eq": operators.eq,
    "neq": operators.ne,
    "gt": operators.gt,
    "gte": operators.ge,
    "lt": operators.lt,
    "lte": operators.le,
}


AND_OR_OPERATORS = {
    "and_": and_,
    "or_": or_,
}


IN_NOT_IN_OPERATORS = {
    "in_int": "in_",
    "notin_int": "notin_",
    "in_str": "in_",
    "notin_str": "notin_",
}
