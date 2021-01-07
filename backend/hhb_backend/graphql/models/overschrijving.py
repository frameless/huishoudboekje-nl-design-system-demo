import graphene
from flask import request

from hhb_backend.graphql.scalars.bedrag import Bedrag
import hhb_backend.graphql.models.afspraak as afspraak
import hhb_backend.graphql.models.export as export
import hhb_backend.graphql.models.bank_transaction as bank_transaction

class OverschrijvingStatus(graphene.Enum):
    GEREED = 1
    IN_BEHANDELING = 2
    VERWACHTING = 3

class Overschrijving(graphene.ObjectType):
    id = graphene.Int()
    afspraak = graphene.Field(lambda: afspraak.Afspraak)
    export = graphene.Field(lambda: export.Export)
    datum = graphene.String()
    bedrag = graphene.Field(Bedrag)
    bankTransaction = graphene.Field(lambda: bank_transaction.BankTransaction)
    status = graphene.Field(OverschrijvingStatus)
    afspraken = graphene.List(lambda: afspraak.Afspraak)

    async def resolve_afspraak(root, info):
        if root.get('afspraak_id'):
            return await request.dataloader.afspraken_by_id.load(root.get('afspraak_id'))

    async def resolve_export(root, info):
        if root.get('export_id'):
            return await request.dataloader.exports_by_id.load(root.get('export_id'))

    def resolve_status(root, info):
        if root.get("bank_transaction_id", None):
            return OverschrijvingStatus.GEREED
        if root.get("export_id", None):
            return OverschrijvingStatus.IN_BEHANDELING
        return OverschrijvingStatus.VERWACHTING

    async def resolve_afspraken(root, info):
        """ Get afspraken when requested """
        if root.get('afspraken'):
            return await request.dataloader.afspraken_by_id.load_many(root.get('afspraken')) or []