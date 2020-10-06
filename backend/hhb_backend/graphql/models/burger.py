import graphene
from datetime import datetime

class Burger(graphene.ObjectType):
    geslachtsnaam = graphene.String()
    huisletter = graphene.String() ??
    huisnummer = graphene.Int()
    huistoevoeging = graphene.String() ??
    postcode = graphene.String()
    straatnaam = graphene.String()
    voorletters = graphene.String()
    voornamen = graphene.String()
    voorvoegsel = graphene.String() ??
    woonplaatsnaam = graphene.String()