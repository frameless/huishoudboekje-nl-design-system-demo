""" Saldo model as used in GraphQL queries """
import graphene

from hhb_backend.graphql.scalars.bedrag import Bedrag


class Saldo(graphene.ObjectType):
    saldo = graphene.Field(Bedrag)
