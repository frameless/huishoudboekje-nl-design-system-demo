""" GebruikersActiviteit model as used in GraphQL queries """
import graphene
from datetime import datetime
from flask import request

import hhb_backend.graphql.models.afdeling as afdeling
import hhb_backend.graphql.models.afspraak as afspraak
import hhb_backend.graphql.models.alarm as alarm
import hhb_backend.graphql.models.bank_transaction as bank_transaction
import hhb_backend.graphql.models.burger as burger
import hhb_backend.graphql.models.configuratie as configuratie
import hhb_backend.graphql.models.customer_statement_message as customer_statement_message
import hhb_backend.graphql.models.export as export
import hhb_backend.graphql.models.grootboekrekening as grootboekrekening
import hhb_backend.graphql.models.huishouden as huishouden
import hhb_backend.graphql.models.journaalpost as journaalpost
import hhb_backend.graphql.models.organisatie as organisatie
import hhb_backend.graphql.models.postadres as postadres
import hhb_backend.graphql.models.rekening as rekening
import hhb_backend.graphql.models.rubriek as rubriek
import hhb_backend.graphql.models.signaal as signaal
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.pageinfo import PageInfo


class GebruikersActiviteitMeta(graphene.ObjectType):
    userAgent = graphene.String()
    ip = graphene.List(graphene.String)
    applicationVersion = graphene.String()

    def resolve_ip(root, info):
        value = root.get("ip")
        if value:
            return value.split(",")


class GebruikersActiviteitSnapshot(graphene.ObjectType):
    afdeling = graphene.Field(lambda: afdeling.Afdeling)
    afspraak = graphene.Field(lambda: afspraak.Afspraak)
    burger = graphene.Field(lambda: burger.Burger)
    configuratie = graphene.Field(lambda: configuratie.Configuratie)
    customer_statement_message = graphene.Field(lambda: customer_statement_message.CustomerStatementMessage)
    export = graphene.Field(lambda: export.Export)
    grootboekrekening = graphene.Field(lambda: grootboekrekening.Grootboekrekening)
    huishouden = graphene.Field(lambda: huishouden.Huishouden)
    journaalpost = graphene.Field(lambda: journaalpost.Journaalpost)
    organisatie = graphene.Field(lambda: organisatie.Organisatie)
    postadres = graphene.Field(lambda: postadres.Postadres)
    rubriek = graphene.Field(lambda: rubriek.Rubriek)
    transaction = graphene.Field(lambda: bank_transaction.BankTransaction)
    alarm = graphene.Field(lambda: alarm.Alarm)
    signaal = graphene.Field(lambda: signaal.Signaal)

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
    def resolve_afdeling(cls, root, _info):
        return cls._resolve_snapshot(root, "afdeling", afdeling.Afdeling)

    @classmethod
    def resolve_postadres(cls, root, _info):
        return cls._resolve_snapshot(root, "postadres", postadres.Postadres)

    @classmethod
    def resolve_afspraak(cls, root, _info):
        return cls._resolve_snapshot(root, "afspraak", afspraak.Afspraak)

    @classmethod
    def resolve_burger(cls, root, _info):
        return cls._resolve_snapshot(root, "burger", burger.Burger)

    @classmethod
    def resolve_configuratie(cls, root, _info):
        return cls._resolve_snapshot(root, "configuratie", configuratie.Configuratie)

    @classmethod
    def resolve_customer_statement_message(cls, root, _info):
        return cls._resolve_snapshot(root, "customer_statement_message",
                                     customer_statement_message.CustomerStatementMessage)

    @classmethod
    def resolve_export(cls, root, _info):
        return cls._resolve_snapshot(root, "export", export.Export)

    @classmethod
    def resolve_grootboekrekening(cls, root, _info):
        return cls._resolve_snapshot(root, "grootboekrekening", grootboekrekening.Grootboekrekening)

    @classmethod
    def resolve_journaalpost(cls, root, _info):
        return cls._resolve_snapshot(root, "journaalpost", journaalpost.Journaalpost)

    @classmethod
    def resolve_organisatie(cls, root, _info):
        return cls._resolve_snapshot(root, "organisatie", organisatie.Organisatie)

    @classmethod
    def resolve_rubriek(cls, root, _info):
        return cls._resolve_snapshot(root, "rubriek", rubriek.Rubriek)

    @classmethod
    def resolve_transaction(cls, root, _info):
        return cls._resolve_snapshot(root, "transaction", bank_transaction.BankTransaction)

    @classmethod
    def resolve_huishouden(cls, root, _info):
        return cls._resolve_snapshot(root, "huishouden", huishouden.Huishouden)

    @classmethod
    def resolve_alarm(cls, root, _info):
        return cls._resolve_snapshot(root, "alarm", alarm.Alarm)

    @classmethod
    def resolve_signaal(cls, root, _info):
        return cls._resolve_snapshot(root, "signaal", signaal.Signaal)


class GebruikersActiviteitEntity(graphene.ObjectType):
    """Dit model beschrijft de wijzingen die een gebruiker heeft gedaan."""
    entityType = graphene.String()
    entityId = graphene.String()

    afdeling = graphene.Field(lambda: afdeling.Afdeling)
    postadres = graphene.Field(lambda: postadres.Postadres)
    afspraak = graphene.Field(lambda: afspraak.Afspraak)
    burger = graphene.Field(lambda: burger.Burger)
    configuratie = graphene.Field(lambda: configuratie.Configuratie)
    customer_statement_message = graphene.Field(lambda: customer_statement_message.CustomerStatementMessage)
    export = graphene.Field(lambda: export.Export)
    grootboekrekening = graphene.Field(lambda: grootboekrekening.Grootboekrekening)
    journaalpost = graphene.Field(lambda: journaalpost.Journaalpost)
    organisatie = graphene.Field(lambda: organisatie.Organisatie)
    rekening = graphene.Field(lambda: rekening.Rekening)
    rubriek = graphene.Field(lambda: rubriek.Rubriek)
    transaction = graphene.Field(lambda: bank_transaction.BankTransaction)
    huishouden = graphene.Field(lambda: huishouden.Huishouden)
    alarm = graphene.Field(lambda: alarm.Alarm)
    signaal = graphene.Field(lambda: signaal.Signaal)

    @classmethod
    async def _resolve_entity(cls, root, entity_type: str, dataloader_name: str):
        if root.get("entityType") == entity_type:
            return hhb_dataloader()[dataloader_name].load_one(root.get("entityId"))

    @classmethod
    async def resolve_afdeling(cls, root, _info):
        return await cls._resolve_entity(
            root, entity_type="afdeling", dataloader_name="afdelingen"
        )

    @classmethod
    async def resolve_postadres(cls, root, _info):
        return await cls._resolve_entity(
            root, entity_type="postadres", dataloader_name="postadressen"
        )

    @classmethod
    async def resolve_afspraak(cls, root, _info):
        return await cls._resolve_entity(
            root, entity_type="afspraak", dataloader_name="afspraken"
        )

    @classmethod
    async def resolve_burger(cls, root, _info):
        return await cls._resolve_entity(
            root, entity_type="burger", dataloader_name="burgers"
        )

    @classmethod
    async def resolve_configuratie(cls, root, _info):
        return await cls._resolve_entity(
            root, entity_type="configuratie", dataloader_name="configuraties"
        )

    @classmethod
    async def resolve_customer_statement_message(cls, root, _info):
        if root.get("entityType") == "customerStatementMessage":
            return hhb_dataloader().csms.load_one(root.get("entityId"))
        return await cls._resolve_entity(
            root, entity_type="customer_statement_message", dataloader_name="csms"
        )

    @classmethod
    async def resolve_export(cls, root, _info):
        return await cls._resolve_entity(
            root, entity_type="export", dataloader_name="exports"
        )

    @classmethod
    async def resolve_grootboekrekening(cls, root, _info):
        return await cls._resolve_entity(
            root,
            entity_type="grootboekrekening",
            dataloader_name="grootboekrekeningen",
        )

    @classmethod
    async def resolve_journaalpost(cls, root, _info):
        return await cls._resolve_entity(
            root, entity_type="journaalpost", dataloader_name="journaalposten"
        )

    @classmethod
    async def resolve_organisatie(cls, root, _info):
        return await cls._resolve_entity(
            root, entity_type="organisatie", dataloader_name="organisaties"
        )

    @classmethod
    async def resolve_rekening(cls, root, _info):
        return await cls._resolve_entity(
            root, entity_type="rekening", dataloader_name="rekeningen"
        )

    @classmethod
    async def resolve_rubriek(cls, root, _info):
        return await cls._resolve_entity(
            root, entity_type="rubriek", dataloader_name="rubrieken"
        )

    @classmethod
    async def resolve_transactie(cls, root, _info):
        return await cls._resolve_entity(
            root, entity_type="transactie", dataloader_name="bank_transactions"
        )

    @classmethod
    async def resolve_huishouden(cls, root, _info):
        return await cls._resolve_entity(
            root, entity_type="huishouden", dataloader_name="huishoudens"
        )

    @classmethod
    async def resolve_alarm(cls, root, _info):
        return await cls._resolve_entity(
            root, entity_type="alarm", dataloader_name="alarms"
        )

    @classmethod
    async def resolve_signaal(cls, root, _info):
        return await cls._resolve_entity(
            root, entity_type="signaal", dataloader_name="signals"
        )


class GebruikersActiviteit(graphene.ObjectType):
    """Model dat een actie van een gebruiker beschrijft."""

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


class GebruikersActiviteitenPaged(graphene.ObjectType):
    gebruikersactiviteiten = graphene.List(
        GebruikersActiviteit
    )
    page_info = graphene.Field(lambda: PageInfo)
