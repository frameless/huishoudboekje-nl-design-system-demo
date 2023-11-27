import graphene

from hhb_backend.graphql.models.bank_transaction import BankTransaction
from hhb_backend.graphql.dataloaders import hhb_dataloader


class Overzicht(graphene.ObjectType):
    id = graphene.Int()
    burger_id = graphene.Int()
    organisatie_id = graphene.Int()
    omschrijving = graphene.String()
    rekeninghouder = graphene.String()
    tegen_rekening_id = graphene.Int()
    totaal_uitgaven = graphene.Decimal()
    valid_from = graphene.String()
    valid_through = graphene.String()
    transactions = graphene.List(lambda: BankTransaction)
