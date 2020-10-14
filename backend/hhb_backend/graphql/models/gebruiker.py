""" Gebruiker model as used in GraphQL queries """
import graphene


class Gebruiker(graphene.ObjectType):
    """ GraphQL Gebruiker model """
    id = graphene.Int()
    telefoonnummer = graphene.String()
    email = graphene.String()
    geboortedatum = graphene.String()
    weergave_naam = graphene.String()
    iban = graphene.String()
    achternaam = graphene.String()
    huisnummer = graphene.String()
    postcode = graphene.String()
    straatnaam = graphene.String()
    voorletters = graphene.String()
    voornamen = graphene.String()
    woonplaatsnaam = graphene.String()
