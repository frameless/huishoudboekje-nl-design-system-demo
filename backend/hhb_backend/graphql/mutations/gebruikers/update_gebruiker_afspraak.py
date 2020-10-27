""" GraphQL mutation for updating an Afspraak """
import graphene
from graphql import GraphQLError

from hhb_backend.graphql import settings
import hhb_backend.graphql.models.afspraak as afspraak
from hhb_backend.graphql.scalars.bedrag import Bedrag


class UpdateAfspraakInput(graphene.InputObjectType):
    id = graphene.Int()
    beschrijving = graphene.String()
    start_datum = graphene.Date()
    eind_datum = graphene.Date()
    aantal_betalingen = graphene.Int()
    interval = graphene.String()  # TODO use interval scalar
    tegen_rekening_id = graphene.Int()
    bedrag = graphene.Field(Bedrag)
    credit = graphene.Boolean()
    kenmerk = graphene.String()
    actief = graphene.Boolean()


class UpdateGebruikerAfspraak(graphene.Mutation):
    class Arguments:
        afspraak = graphene.Argument(lambda: UpdateAfspraakInput)

    ok = graphene.Boolean()
    afspraak = graphene.Field(lambda: afspraak.Afspraak)

    def mutate(root, info, **kwargs):
        """ Update the Afspraak """
        return UpdateGebruikerAfspraak(afspraak={
            "id": 1
        }, ok=True)
