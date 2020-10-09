""" GraphQL schema queries module """
import graphene
from .gebruiker import GebruikersQuery, GebruikerQuery

class RootQuery(graphene.ObjectType):
    """ The root of all queries """
    gebruiker = GebruikerQuery.return_type
    gebruikers = GebruikersQuery.return_type

    def resolve_gebruiker(root, info, **kwargs):
        return GebruikerQuery().resolver(root, info, **kwargs)

    def resolve_gebruikers(root, info, **kwargs):
        return GebruikersQuery().resolver(root, info, **kwargs)
