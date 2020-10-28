""" Afspraak model as used in GraphQL queries """
import graphene

import hhb_backend.graphql.models.gebruiker as gebruiker
import hhb_backend.graphql.models.rekening as rekening
from hhb_backend.graphql.models import organisatie
from hhb_backend.graphql.scalars.bedrag import Bedrag
from hhb_backend.utils import convert_hhb_interval_to_dict

class Interval(graphene.ObjectType):
    jaren = graphene.Int()
    maanden = graphene.Int()
    weken = graphene.Int()
    dagen = graphene.Int()

class IntervalInput(graphene.InputObjectType):
    jaren = graphene.Int()
    maanden = graphene.Int()
    weken = graphene.Int()
    dagen = graphene.Int()
    
class Afspraak(graphene.ObjectType):
    """ GraphQL Afspraak model """
    id = graphene.Int()
    gebruiker = graphene.Field(lambda: gebruiker.Gebruiker)
    beschrijving = graphene.String()
    start_datum = graphene.Date()
    eind_datum = graphene.Date()
    aantal_betalingen = graphene.Int()
    interval = graphene.Field(Interval)
    tegen_rekening = graphene.Field(lambda: rekening.Rekening)
    bedrag = graphene.Field(Bedrag)
    credit = graphene.Boolean()
    kenmerk = graphene.String()
    actief = graphene.Boolean()
    organisatie = graphene.Field(lambda: organisatie.Organisatie)

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

    def resolve_organisatie(root, info):
        """ Get organisatie from the tegen_rekening"""

        return {
            "id": 1,
            "weergave_naam": "A"
        }

    def resolve_interval(root, info):
        return convert_hhb_interval_to_dict(root.get("interval"))
