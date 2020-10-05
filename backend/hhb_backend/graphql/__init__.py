import graphene

class TestObject(graphene.ObjectType):
    name = graphene.String()

class TestMutation(graphene.Mutation):
    class Arguments:
        name = graphene.String()

    ok = graphene.Boolean()
    test_object = graphene.Field(lambda: TestObject)

    def mutate(root, info, name):
        test_object = TestObject(name=name)
        ok = True
        return TestMutation(test_object=test_object, ok=ok)

class RootQuery(graphene.ObjectType):
    testobjects = graphene.List(TestObject, name=graphene.String(default_value="stranger"))

    def resolve_testobjects(root, info, name):
        test_object = TestObject(name=name)
        return [test_object]

class RootMutation(graphene.ObjectType):
    test_mutation = TestMutation.Field()

schema = graphene.Schema(
    query=RootQuery,
    mutation=RootMutation
)
