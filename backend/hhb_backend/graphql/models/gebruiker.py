""" Gebruiker model as used in GraphQL queries """
import graphene
from hhb_backend.graphql.models.rekening import Rekening

class Gebruiker(graphene.ObjectType):
    """ GraphQL Gebruiker model """
    id = graphene.Int()
    telefoonnummer = graphene.String()
    email = graphene.String()
    geboortedatum = graphene.String()
    iban = graphene.String(deprecation_reason="Please use 'rekeningen'")
    achternaam = graphene.String()
    huisnummer = graphene.String()
    postcode = graphene.String()
    straatnaam = graphene.String()
    voorletters = graphene.String()
    voornamen = graphene.String()
    plaatsnaam = graphene.String()
    rekeningen = graphene.List(Rekening)

    def resolve_iban(root, info):
        firstRekening = next(iter(root.get('rekeningen')), None)
        if firstRekening is not None:
            return firstRekening.get('iban')
        return None
