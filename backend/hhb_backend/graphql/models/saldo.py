""" Saldo model as used in GraphQL queries """
import graphene

from hhb_backend.graphql.scalars.bedrag import Bedrag


class Saldo(graphene.ObjectType):
    id = graphene.Int()
    burger_id = graphene.Int()
    saldo = graphene.Field(Bedrag)
    begindatum = graphene.String()
    einddatum = graphene.String()
