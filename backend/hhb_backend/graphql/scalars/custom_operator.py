import graphene

from .dynamic_types import DynamicType


class ComplexFilterType(graphene.InputObjectType):
    neq = DynamicType()
    eq = DynamicType()
    gt = DynamicType()
    gte = DynamicType()
    lt = DynamicType()
    lte = DynamicType()
    in_ = graphene.List(DynamicType)
    notin_ = graphene.List(DynamicType)
