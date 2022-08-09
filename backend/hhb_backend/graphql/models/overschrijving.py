import graphene

import hhb_backend.graphql.models.afspraak as afspraak
import hhb_backend.graphql.models.bank_transaction as bank_transaction
import hhb_backend.graphql.models.export as export
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.scalars.bedrag import Bedrag


class OverschrijvingStatus(graphene.Enum):
    GEREED = 1
    IN_BEHANDELING = 2
    VERWACHTING = 3


class Overschrijving(graphene.ObjectType):
    id = graphene.Int()
    bedrag = graphene.Field(Bedrag)
    datum = graphene.String()
    status = graphene.Field(OverschrijvingStatus)
    afspraak = graphene.Field(lambda: afspraak.Afspraak)
    export = graphene.Field(lambda: export.Export)
    bankTransaction = graphene.Field(lambda: bank_transaction.BankTransaction)
    afspraken = graphene.List(lambda: afspraak.Afspraak)

    async def resolve_afspraak(self, info):
        if self.get('afspraak_id'):
            return hhb_dataloader().afspraak_by_id.load(self.get('afspraak_id'))

    async def resolve_export(self, info):
        if self.get('export_id'):
            return hhb_dataloader().export_by_id.load(self.get('export_id'))

    def resolve_status(self, info):
        if self.get("bank_transaction_id", None):
            return OverschrijvingStatus.GEREED
        if self.get("export_id", None):
            return OverschrijvingStatus.IN_BEHANDELING
        return OverschrijvingStatus.VERWACHTING

    async def resolve_afspraken(self, info):
        """ Get afspraken when requested """
        if self.get('afspraken'):
            return hhb_dataloader().afspraak_by_id.load_many(self.get('afspraken')) or []