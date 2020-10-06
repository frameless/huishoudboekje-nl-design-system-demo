import graphene
from datetime import datetime

class Burger(graphene.ObjectType):
    achternaam = graphene.String()
    huisnummer = graphene.String()
    postcode = graphene.String()
    straatnaam = graphene.String()
    voorletters = graphene.String()
    voornamen = graphene.String()
    woonplaatsnaam = graphene.String()
