import graphene
from hhb_backend.graphql.models.gebruiker import Gebruiker
from .testobject import result as testobject_result, resolver as testobject_resolver
from .gebruiker import result as gebruiker_result, resolver as gebruikers_resolver

class RootQuery(graphene.ObjectType):
    gebruikers = gebruiker_result
    testobjects = testobject_result

    def resolve_testobjects(root, info, name):
        return testobject_resolver(root, info, name)

    def resolve_gebruikers(root, info):
        return gebruikers_resolver(root, info)