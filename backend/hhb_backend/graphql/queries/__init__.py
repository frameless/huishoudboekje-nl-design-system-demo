import graphene
from hhb_backend.graphql.models.gebruiker import Gebruiker
from .gebruiker import result as gebruiker_result, resolver as gebruikers_resolver

class RootQuery(graphene.ObjectType):
    gebruikers = gebruiker_result

    def resolve_gebruikers(root, info):
        return gebruikers_resolver(root, info)