import graphene

from .bedrag import Bedrag
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
    BTWN = graphene.List(DynamicType)


class ComplexBedragFilterType(graphene.InputObjectType):
    EQ = graphene.Argument(Bedrag)
    NEQ = graphene.Argument(Bedrag)
    GT = graphene.Argument(Bedrag)
    GTE = graphene.Argument(Bedrag)
    LT = graphene.Argument(Bedrag)
    LTE = graphene.Argument(Bedrag)
    IN = graphene.List(Bedrag)
    NOTIN = graphene.List(Bedrag)
    BTWN = graphene.List(Bedrag)
