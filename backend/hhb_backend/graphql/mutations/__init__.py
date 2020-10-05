import graphene
from .testobject import TestMutation

class RootMutation(graphene.ObjectType):
    test_mutation = TestMutation.Field()
