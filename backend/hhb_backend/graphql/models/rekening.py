""" Rekening model as used in GraphQL queries """
import graphene
from flask import request
from hhb_backend.graphql.models import burger
import hhb_backend.graphql.models.organisatie as organisatie
import hhb_backend.graphql.models.afspraak as afspraak

class Rekening(graphene.ObjectType):
    """GraphQL Rekening model"""
    id = graphene.Int()
    iban = graphene.String()
    rekeninghouder = graphene.String()
    burgers = graphene.List(lambda: burger.Burger)
    organisaties = graphene.List(lambda: organisatie.Organisatie)
    afspraken = graphene.List(lambda: afspraak.Afspraak)

    async def resolve_burgers(root, info):
        """ Get burgers when requested """
        if root.get('burgers'):
            return await request.dataloader.burgers_by_id.load_many(root.get('burgers')) or []

    async def resolve_organisaties(root, info):
        """ Get organisaties when requested """
        if root.get('organisaties'):
            return await request.dataloader.organisaties_by_id.load_many(root.get('organisaties')) or []
    
    async def resolve_afspraken(root, info):
        """ Get afspraken when requested """
        if root.get('afspraken'):
            return await request.dataloader.afspraken_by_id.load_many(root.get('afspraken')) or []