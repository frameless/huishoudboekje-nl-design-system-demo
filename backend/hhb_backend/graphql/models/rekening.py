""" Rekening model as used in GraphQL queries """
import graphene


class Rekening(graphene.ObjectType):
    """GraphQL Rekening model"""
    id = graphene.Int()
    iban = graphene.String()
    rekeninghouder = graphene.String()
