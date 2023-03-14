import graphene

import hhb_backend.graphql.models.burger as burger
from hhb_backend.graphql.dataloaders import hhb_dataloader

class RapportageTransactie(graphene.ObjectType):
    bedrag = graphene.Decimal()
    rekeninghouder = graphene.String()
    transactie_datum = graphene.String()

class RapportageRubriek(graphene.ObjectType):
    rubriek = graphene.String()
    transacties = graphene.List(lambda: RapportageTransactie)

class BurgerRapportage(graphene.ObjectType):
    burger = graphene.Field(lambda: burger.Burger)
    start_datum = graphene.String()
    eind_datum = graphene.String()
    totaal = graphene.Decimal()
    totaal_inkomsten = graphene.Decimal()
    totaal_uitgaven = graphene.Decimal()
    inkomsten = graphene.List(lambda: RapportageRubriek)
    uitgaven = graphene.List(lambda: RapportageRubriek)

    def resolve_burger(root, info):
        """ Get burger when requested """
        if root.get("burger_id"):
            return hhb_dataloader().burgers.load_one(root.get("burger_id"))
