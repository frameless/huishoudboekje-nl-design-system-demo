""" Rekening model as used in GraphQL queries """
import graphene


class Rekening(graphene.ObjectType):
    """GraphQL Rekening model"""
    iban = graphene.String()
    rekeninghouder = graphene.String()
