import graphene

class TestObject(graphene.ObjectType):
    name = graphene.String()