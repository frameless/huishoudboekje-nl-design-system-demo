""" GraphQL schema mutations module """
import graphene
from .gebruikers.create_gebruiker import CreateGebruiker
from .gebruikers.delete_gebruiker import DeleteGebruiker
from .gebruikers.update_gebruiker import UpdateGebruiker

class RootMutation(graphene.ObjectType):
    """ The root of all mutations """
    create_gebruiker = CreateGebruiker.Field()
    delete_gebruiker = DeleteGebruiker.Field()
    updateGebruiker = UpdateGebruiker.Field()
