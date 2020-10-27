""" GraphQL mutation for creating a new Afspraak """

import graphene
from graphql import GraphQLError

from hhb_backend.graphql import settings
import hhb_backend.graphql.models.afspraak as afspraak
import hhb_backend.graphql.models.gebruiker as gebruiker
from hhb_backend.graphql.mutations.rekening_input import RekeningInput
from hhb_backend.graphql.scalars.bedrag import Bedrag


class AfspraakInput(graphene.InputObjectType):
    id = graphene.Int()
    gebruiker_id = graphene.Int()
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


class AddGebruikerAfspraak(graphene.Mutation):
    class Arguments:
        afspraak = graphene.Argument(lambda: AfspraakInput)

    ok = graphene.Boolean()
    afspraak = graphene.Field(lambda: afspraak.Afspraak)

    def mutate(root, info, **kwargs):
        """ Create the new Gebruiker/Burger """
        return AddGebruikerAfspraak(afspraak={
            "id": 1
        }, ok=True)
