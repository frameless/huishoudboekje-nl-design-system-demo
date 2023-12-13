import graphene

from hhb_backend.graphql.models.bank_transaction import BankTransaction
from hhb_backend.graphql.dataloaders import hhb_dataloader


class Overzicht(graphene.ObjectType):
    afspraken = graphene.List(lambda: OverzichtAfspraak)
    saldos = graphene.List(lambda: OverzichtSaldo)


class OverzichtAfspraak(graphene.ObjectType):
    id = graphene.Int()
    burger_id = graphene.Int()
    organisatie_id = graphene.Int()
    omschrijving = graphene.String()
    rekeninghouder = graphene.String()
    tegen_rekening_id = graphene.Int()
    valid_from = graphene.String()
    valid_through = graphene.String()
    transactions = graphene.List(lambda: BankTransaction)


class OverzichtSaldo(graphene.ObjectType):
    maandnummer = graphene.Int()
    start_saldo = graphene.Decimal()
    eind_saldo = graphene.Decimal()
    mutatie = graphene.Decimal()
