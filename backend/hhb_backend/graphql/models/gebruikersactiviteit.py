""" GebruikersActiviteit model as used in GraphQL queries """
from datetime import datetime

import graphene
from flask import request

from hhb_backend.graphql.models.afspraak import Afspraak
from hhb_backend.graphql.models.gebruiker import Gebruiker
from hhb_backend.graphql.models.journaalpost import Journaalpost
from hhb_backend.graphql.models.organisatie import Organisatie
from hhb_backend.graphql.models.rekening import Rekening


class GebruikersActiviteitMeta(graphene.ObjectType):
    userAgent = graphene.String()
    ip = graphene.List(graphene.String)
    applicationVersion = graphene.String()

    def resolve_ip(root, info):
        value = root.get("ip")
        if value:
            return value.split(",")


class GebruikersActiviteitSnapshot(graphene.ObjectType):
    burger = graphene.Field(lambda: Gebruiker)
    afspraak = graphene.Field(lambda: Afspraak)
    journaalpost = graphene.Field(lambda: Journaalpost)
    organisatie = graphene.Field(lambda: Organisatie)

    @staticmethod
    def __resolve_snapshot(root, entity_type: str, Model):
        value = root.get(entity_type)
        if value:
            while True:
                try:
                    return Model(**value)
                except TypeError as e:
                    bad_key = str(e).split("'")[1]
                    value.pop(bad_key)
                    continue

    def resolve_burger(root, info):
        return GebruikersActiviteitSnapshot.__resolve_snapshot(
            root, "burger", Gebruiker
        )

    def resolve_afspraak(root, info):
        return GebruikersActiviteitSnapshot.__resolve_snapshot(
            root, "afspraak", Afspraak
        )

    def resolve_journaalpost(root, info):
        return GebruikersActiviteitSnapshot.__resolve_snapshot(
            root, "journaalpost", Journaalpost
        )

    def resolve_organisatie(root, info):
        return GebruikersActiviteitSnapshot.__resolve_snapshot(
            root, "organisatie", Organisatie
        )


class GebruikersActiviteitEntity(graphene.ObjectType):
    entityType = graphene.String()
    entityId = graphene.Int()

    burger = graphene.Field(lambda: Gebruiker)
    organisatie = graphene.Field(lambda: Organisatie)
    afspraak = graphene.Field(lambda: Afspraak)
    rekening = graphene.Field(lambda: Rekening)

    @staticmethod
    async def __resolve_enity(root, entity_type: str, dataloader_name: str):
        if root.get("entityType") == entity_type:
            return await request.dataloader[dataloader_name].load(root.get("entityId"))

    async def resolve_burger(root, info):
        return await GebruikersActiviteitEntity.__resolve_enity(
            root, entity_type="burger", dataloader_name="gebruikers_by_id"
        )

    async def resolve_organisatie(root, info):
        return await GebruikersActiviteitEntity.__resolve_enity(
            root, entity_type="organisatie", dataloader_name="organisaties_by_id"
        )

    async def resolve_afspraak(root, info):
        return await GebruikersActiviteitEntity.__resolve_enity(
            root, entity_type="afspraak", dataloader_name="afspraken_by_id"
        )

    async def resolve_rekening(root, info):
        return await GebruikersActiviteitEntity.__resolve_enity(
            root, entity_type="rekening", dataloader_name="rekeningen_by_id"
        )


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
        value = root.get("timestamp")
        if value:
            return datetime.fromisoformat(value)

    # async def resolve_gebruiker(root, info):
    #     # TODO medewerker?
    #     if root.get('gebruiker_id'):
    #         return await request.dataloader.gebruikers_by_id.load(root.get('gebruiker_id'))
