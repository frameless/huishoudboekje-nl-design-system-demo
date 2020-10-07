import graphene
from .gebruikers.create_gebruiker import CreateGebruiker
from .gebruikers.delete_gebruiker import DeleteGebruiker

class RootMutation(graphene.ObjectType):
    create_gebruiker = CreateGebruiker.Field()
    delete_gebruiker = DeleteGebruiker.Field()
