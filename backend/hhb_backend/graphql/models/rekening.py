""" Rekening model as used in GraphQL queries """
import graphene
from flask import request
import hhb_backend.graphql.models.gebruiker as gebruiker
import hhb_backend.graphql.models.organisatie as organisatie
import hhb_backend.graphql.models.afspraak as afspraak

class Rekening(graphene.ObjectType):
    """GraphQL Rekening model"""
    id = graphene.Int()
    iban = graphene.String()
    rekeninghouder = graphene.String()
    gebruikers = graphene.List(lambda: gebruiker.Gebruiker)
    organisaties = graphene.List(lambda: organisatie.Organisatie)
    afspraken = graphene.List(lambda: afspraak.Afspraak)

    async def resolve_gebruikers(root, info):
        """ Get gebruikers when requested """
        if root.get('gebruikers'):
            return await request.dataloader.gebruikers_by_id.load_many(root.get('gebruikers')) or []

    async def resolve_organisaties(root, info):
        """ Get organisaties when requested """
        if root.get('organisaties'):
            return await request.dataloader.organisaties_by_id.load_many(root.get('organisaties')) or []
    
    async def resolve_afspraken(root, info):
        """ Get afspraken when requested """
        if root.get('afspraken'):
            return await request.dataloader.afspraken_by_id.load_many(root.get('afspraken')) or []