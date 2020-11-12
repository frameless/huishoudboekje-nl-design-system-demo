""" Afspraak model as used in GraphQL queries """
from datetime import date

import graphene
from flask import request
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

    async def resolve_gebruiker(root, info):
        """ Get gebruiker when requested """
        if root.get('gebruiker_id'):
            return await request.dataloader.gebruikers_by_id.load(root.get('gebruiker_id'))

    async def resolve_tegen_rekening(root, info):
        """ Get tegen_rekening when requested """
        if root.get('tegen_rekening_id'):
            return await request.dataloader.rekeningen_by_id.load(root.get('tegen_rekening_id'))

    def resolve_start_datum(root, info):
        value = root.get('start_datum')
        if value:
            return date.fromisoformat(value)

    def resolve_eind_datum(root, info):
        value = root.get('eind_datum')
        if value:
            return date.fromisoformat(value)

    def resolve_interval(root, info):
        value = root.get('interval')
        if value:
            return convert_hhb_interval_to_dict(value)
        else:
            return {"jaren": 0, "maanden": 0, "weken": 0, "dagen":0}

    async def resolve_organisatie(root, info):
        """ Get organisatie when requested """
        if root.get('organisatie_id'):
            return await request.dataloader.organisaties_by_id.load(root.get('organisatie_id'))
