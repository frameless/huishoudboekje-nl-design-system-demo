""" Rekening model as used in GraphQL queries """
import graphene
from flask import request
import hhb_backend.graphql.models.burger as burger
import hhb_backend.graphql.models.afdeling as afdeling
import hhb_backend.graphql.models.afspraak as afspraak

class Rekening(graphene.ObjectType):
    """GraphQL Rekening model"""
    id = graphene.Int()
    iban = graphene.String()
    rekeninghouder = graphene.String()
    burgers = graphene.List(lambda: burger.Burger)
    afdelingen = graphene.List(lambda: afdeling.Afdeling)
    afspraken = graphene.List(lambda: afspraak.Afspraak)

    async def resolve_burgers(root, info):
        """ Get burgers when requested """
        if root.get('burgers'):
            return await request.dataloader.burgers_by_id.load_many(root.get('burgers')) or []

    async def resolve_afdelingen(root, info):
        """ Get afdelingen when requested """
        if root.get('afdelingen'):
            return await request.dataloader.afdelingen_by_id.load_many(root.get('afdelingen')) or []
    
    async def resolve_afspraken(root, info):
        """ Get afspraken when requested """
        if root.get('afspraken'):
            return await request.dataloader.afspraken_by_id.load_many(root.get('afspraken')) or []