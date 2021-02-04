""" GebruikersActiviteit model as used in GraphQL queries """
from datetime import datetime

import graphene
from flask import request

from hhb_backend.graphql.models.afspraak import Afspraak
from hhb_backend.graphql.models.bank_transaction import BankTransaction
from hhb_backend.graphql.models.configuratie import Configuratie
from hhb_backend.graphql.models.customer_statement_message import (
    CustomerStatementMessage,
)
from hhb_backend.graphql.models.export import Export
from hhb_backend.graphql.models.gebruiker import Gebruiker
from hhb_backend.graphql.models.grootboekrekening import Grootboekrekening
from hhb_backend.graphql.models.journaalpost import Journaalpost
from hhb_backend.graphql.models.organisatie import Organisatie
from hhb_backend.graphql.models.rekening import Rekening
from hhb_backend.graphql.models.rubriek import Rubriek


class GebruikersActiviteitMeta(graphene.ObjectType):
    userAgent = graphene.String()
    ip = graphene.List(graphene.String)
    applicationVersion = graphene.String()

    def resolve_ip(root, info):
        value = root.get("ip")
        if value:
            return value.split(",")


class GebruikersActiviteitSnapshot(graphene.ObjectType):
    afspraak = graphene.Field(lambda: Afspraak)
    burger = graphene.Field(lambda: Gebruiker)
    configuratie = graphene.Field(lambda: Configuratie)
    customer_statement_message = graphene.Field(lambda: CustomerStatementMessage)
    export = graphene.Field(lambda: Export)
    grootboekrekening = graphene.Field(lambda: Grootboekrekening)
    journaalpost = graphene.Field(lambda: Journaalpost)
    organisatie = graphene.Field(lambda: Organisatie)
    rubriek = graphene.Field(lambda: Rubriek)
    transaction = graphene.Field(lambda: BankTransaction)

    @classmethod
    def _resolve_snapshot(cls, root, entity_type: str, Model):
        value = root.get(entity_type)
        if value:
            while True:
                # Since there can be fields that cannot be mapped to the Model they will be skipped
                try:
                    return Model(**value)
                except TypeError as e:
                    bad_key = str(e).split("'")[1]
                    value.pop(bad_key)
                    continue

    @classmethod
    def resolve_afspraak(cls, root, _info):
        return cls._resolve_snapshot(root, "afspraak", Afspraak)

    @classmethod
    def resolve_burger(cls, root, _info):
        return cls._resolve_snapshot(root, "burger", Gebruiker)

    @classmethod
    def resolve_configuratie(cls, root, _info):
        return cls._resolve_snapshot(root, "configuratie", Configuratie)

    @classmethod
    def resolve_customer_statement_message(cls, root, _info):
        return cls._resolve_snapshot(
            root, "customer_statement_message", CustomerStatementMessage
        )

    @classmethod
    def resolve_export(cls, root, _info):
        return cls._resolve_snapshot(root, "export", Export)

    @classmethod
    def resolve_grootboekrekening(cls, root, _info):
        return cls._resolve_snapshot(root, "grootboekrekening", Grootboekrekening)

    @classmethod
    def resolve_journaalpost(cls, root, _info):
        return cls._resolve_snapshot(root, "journaalpost", Journaalpost)

    @classmethod
    def resolve_organisatie(cls, root, _info):
        return cls._resolve_snapshot(root, "organisatie", Organisatie)

    @classmethod
    def resolve_rubriek(cls, root, _info):
        return cls._resolve_snapshot(root, "rubriek", Rubriek)

    @classmethod
    def resolve_transaction(cls, root, _info):
        return cls._resolve_snapshot(root, "transaction", BankTransaction)


class GebruikersActiviteitEntity(graphene.ObjectType):
    entityType = graphene.String()
    entityId = graphene.Int()

    afspraak = graphene.Field(lambda: Afspraak)
    burger = graphene.Field(lambda: Gebruiker)
    configuratie = graphene.Field(lambda: Configuratie)
    customer_statement_message = graphene.Field(lambda: CustomerStatementMessage)
    export = graphene.Field(lambda: Export)
    grootboekrekening = graphene.Field(lambda: Grootboekrekening)
    journaalpost = graphene.Field(lambda: Journaalpost)
    organisatie = graphene.Field(lambda: Organisatie)
    rekening = graphene.Field(lambda: Rekening)
    rubriek = graphene.Field(lambda: Rubriek)
    transaction = graphene.Field(lambda: BankTransaction)

    @classmethod
    async def _resolve_entity(cls, root, entity_type: str, dataloader_name: str):
        if root.get("entityType") == entity_type:
            return await request.dataloader[dataloader_name].load(root.get("entityId"))

    @classmethod
    async def resolve_afspraak(cls, root, _info):
        return await cls._resolve_entity(
            root, entity_type="afspraak", dataloader_name="afspraken_by_id"
        )

    @classmethod
    async def resolve_burger(cls, root, _info):
        return await cls._resolve_entity(
            root, entity_type="burger", dataloader_name="gebruikers_by_id"
        )

    @classmethod
    async def resolve_configuratie(cls, root, _info):
        return await cls._resolve_entity(
            root, entity_type="configuratie", dataloader_name="configuratie_by_id"
        )

    @classmethod
    async def resolve_customer_statement_message(cls, root, _info):
        if root.get("entityType") == "customer_statement_message":
            return await request.dataloader["csms_by_id"].load(root.get("entityId"))
        return await cls._resolve_entity(
            root, entity_type="customer_statement_message", dataloader_name="csms_by_id"
        )

    @classmethod
    async def resolve_export(cls, root, _info):
        return await cls._resolve_entity(
            root, entity_type="export", dataloader_name="exports_by_id"
        )

    @classmethod
    async def resolve_grootboekrekening(cls, root, _info):
        return await cls._resolve_entity(
            root,
            entity_type="grootboekrekening",
            dataloader_name="grootboekrekeningen_by_id",
        )

    @classmethod
    async def resolve_journaalpost(cls, root, _info):
        return await cls._resolve_entity(
            root, entity_type="journaalpost", dataloader_name="journaalposten_by_id"
        )

    @classmethod
    async def resolve_organisatie(cls, root, _info):
        return await cls._resolve_entity(
            root, entity_type="organisatie", dataloader_name="organisaties_by_id"
        )

    @classmethod
    async def resolve_rekening(cls, root, _info):
        return await cls._resolve_entity(
            root, entity_type="rekening", dataloader_name="rekeningen_by_id"
        )

    @classmethod
    async def resolve_rubriek(cls, root, _info):
        return await cls._resolve_entity(
            root, entity_type="rubriek", dataloader_name="rubrieken_by_id"
        )

    @classmethod
    async def resolve_transactie(cls, root, _info):
        return await cls._resolve_entity(
            root, entity_type="transactie", dataloader_name="bank_transactions_by_id"
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
