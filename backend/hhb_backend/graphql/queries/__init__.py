""" GraphQL schema queries module """
import graphene
from .gebruiker import GebruikersQuery

class RootQuery(graphene.ObjectType):
    """ The root of all queries """
    gebruikers_query = graphene.Field(GebruikersQuery)

    def resolve_gebruikers_query(parent, info):
        return GebruikersQuery()
