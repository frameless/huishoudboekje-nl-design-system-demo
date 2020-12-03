""" Gebruiker model as used in GraphQL queries """
import graphene

class Export(graphene.ObjectType):
    """ GraphQL Export model """
    id = graphene.Int()