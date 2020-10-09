""" Burger model as used in GraphQL queries """
import graphene

class Burger(graphene.ObjectType):
    """ GraphQL Burger model """
    achternaam = graphene.String()
    huisnummer = graphene.String()
    postcode = graphene.String()
    straatnaam = graphene.String()
    voorletters = graphene.String()
    voornamen = graphene.String()
    woonplaatsnaam = graphene.String()
