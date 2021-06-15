import graphene

from .dynamic_types import DynamicType


class ComplexFilterType(graphene.InputObjectType):
    EQ = DynamicType()
    NEQ = DynamicType()
    GT = DynamicType()
    GTE = DynamicType()
    LT = DynamicType()
    LTE = DynamicType()
    IN = graphene.List(DynamicType)
    NOTIN = graphene.List(DynamicType)
