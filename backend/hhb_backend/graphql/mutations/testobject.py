import graphene
from hhb_backend.graphql.models.testobject import TestObject

class TestMutation(graphene.Mutation):
    class Arguments:
        name = graphene.String()

    ok = graphene.Boolean()
    test_object = graphene.Field(lambda: TestObject)

    def mutate(root, info, name):
        test_object = TestObject(name=name)
        ok = True
        return TestMutation(test_object=test_object, ok=ok)
