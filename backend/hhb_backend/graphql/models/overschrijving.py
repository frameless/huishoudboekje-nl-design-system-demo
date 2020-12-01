import graphene
from hhb_backend.graphql.scalars.bedrag import Bedrag
import hhb_backend.graphql.models.afspraak as afspraak
import hhb_backend.graphql.models.bank_transaction as bank_transaction

class OverschijvingStatus(graphene.Enum):
    GEREED = 1
    IN_BEHANDELING = 2
    VERWACHTING = 3

class Overschijving(graphene.ObjectType):
    id = graphene.Int()
    afspraak = graphene.Field(lambda: afspraak.Afspraak)
    exportBestand = graphene.String()
    datum = graphene.Date()
    bedrag = graphene.Field(Bedrag)
    bankTransaction = graphene.Field(lambda: bank_transaction.BankTransaction)
    status = graphene.Field(OverschijvingStatus)

    def resolve_status(root, info):
        if root.get("bank_transaction_id", None):
            return OverschijvingStatus.GEREED
        if root.get("export_bestand", None):
            return OverschijvingStatus.IN_BEHANDELING
        return OverschijvingStatus.VERWACHTING