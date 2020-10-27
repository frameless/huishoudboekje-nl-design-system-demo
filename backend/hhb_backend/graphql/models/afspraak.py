""" Afspraak model as used in GraphQL queries """
import graphene

import hhb_backend.graphql.models.gebruiker as gebruiker
import hhb_backend.graphql.models.rekening as rekening
from hhb_backend.graphql.scalars.bedrag import Bedrag


class Afspraak(graphene.ObjectType):
    """ GraphQL Afspraak model """
    id = graphene.Int()
    gebruiker = graphene.Field(lambda: gebruiker.Gebruiker)
    beschrijving = graphene.String()
    start_datum = graphene.Date()
    eind_datum = graphene.Date()
    aantal_betalingen = graphene.Int()
    interval = graphene.String()  # TODO use interval scalar
    tegen_rekening = graphene.Field(lambda: rekening.Rekening)
    bedrag = graphene.Field(Bedrag)
    credit = graphene.Boolean()
    kenmerk = graphene.String()
    actief = graphene.Boolean()

    def resolve_gebruiker(root, info):
        """ Get gebruiker when requested """
        return {
            "id": 1,
            "achternaam": "a",
        }

    def resolve_tegen_rekening(root, info):
        """ Get tegen_rekening when requested """
        return {
            "iban": "12",
            "rekeninghouder": "A",
        }
