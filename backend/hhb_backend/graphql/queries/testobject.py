import graphene
from hhb_backend.graphql.models.testobject import TestObject

result = graphene.List(TestObject, name=graphene.String(default_value="stranger"))

def resolver(root, info, name):
    test_object = TestObject(name=name)
    return [test_object]
    