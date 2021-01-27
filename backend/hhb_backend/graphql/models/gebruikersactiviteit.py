""" GebruikersActiviteit model as used in GraphQL queries """
from datetime import date, datetime

import graphene
from flask import request
import hhb_backend.graphql.models.gebruiker as gebruiker
from hhb_backend.graphql.models.afspraak import Afspraak
from hhb_backend.graphql.models.gebruiker import Gebruiker
from hhb_backend.graphql.models.organisatie import Organisatie
from hhb_backend.graphql.models.rekening import Rekening


class GebruikersActiviteitMeta(graphene.ObjectType):
    userAgent = graphene.String()
    ip = graphene.List(graphene.String)
    applicationVersion = graphene.String()

    def resolve_ip(root, info):
        value = root.get('ip')
        if value:
            return value.split(",")


class GebruikersActiviteitSnapshot(graphene.ObjectType):
    burger = graphene.Field(lambda: Gebruiker)
    # organisatie = graphene.Field(lambda: Organisatie)
    # afspraak = graphene.Field(lambda: Afspraak)
    # rekening = graphene.Field(lambda: Rekening)

    def resolve_burger(root, info):
        value = root.get('burger')
        if value:
            return Gebruiker(**value)

class GebruikersActiviteitEntity(graphene.ObjectType):
    entity_type = graphene.String()
    entity_id = graphene.Int()

    burger = graphene.Field(lambda: Gebruiker)
    organisatie = graphene.Field(lambda: Organisatie)
    afspraak = graphene.Field(lambda: Afspraak)
    rekening = graphene.Field(lambda: Rekening)

    async def resolve_burger(root, info):
        if root.get('entity_type') == 'burger':
            return await request.dataloader.gebruikers_by_id.load(root.get('entity_id'))

    async def resolve_organisatie(root, info):
        if root.get('entity_type') == 'organisatie':
            return await request.dataloader.organisaties_by_id.load(root.get('entity_id'))

    async def resolve_afspraak(root, info):
        if root.get('entity_type') == 'afspraak':
            return await request.dataloader.afspraken_by_id.load(root.get('entity_id'))

    async def resolve_rekening(root, info):
        if root.get('entity_type') == 'rekening':
            return await request.dataloader.rekeningen_by_id.load(root.get('entity_id'))


class GebruikersActiviteit(graphene.ObjectType):
    """GebruikersActiviteit model"""
    id = graphene.Int()
    timestamp = graphene.DateTime()
    gebruiker_id = graphene.String()
    action = graphene.String()
    entities = graphene.List(lambda: GebruikersActiviteitEntity)
    snapshot_before = graphene.Field(lambda: GebruikersActiviteitSnapshot)
    snapshot_after = graphene.Field(lambda: GebruikersActiviteitSnapshot)
    meta = graphene.Field(lambda: GebruikersActiviteitMeta)

    def resolve_timestamp(root, info):
        value = root.get('timestamp')
        if value:
            return datetime.fromisoformat(value)

    # async def resolve_gebruiker(root, info):
    #     # TODO medewerker?
    #     if root.get('gebruiker_id'):
    #         return await request.dataloader.gebruikers_by_id.load(root.get('gebruiker_id'))
