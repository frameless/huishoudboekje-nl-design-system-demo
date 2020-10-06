import graphene
from .gebruikers_mutations import CreateGebruiker

class RootMutation(graphene.ObjectType):
    create_gebruiker = CreateGebruiker.Field()
