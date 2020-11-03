""" Gebruiker model as used in GraphQL queries """
import graphene
from flask import request

import hhb_backend.graphql.models.afspraak as afspraak
import hhb_backend.graphql.models.rekening as rekening


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
    rekeningen = graphene.List(lambda: rekening.Rekening)
    afspraken = graphene.List(lambda: afspraak.Afspraak)

    def resolve_iban(root, info):
        rekeningen = Gebruiker.resolve_rekeningen(root, info)
        if rekeningen:
            return rekeningen[0].get('iban')
        return None

    async def resolve_rekeningen(root, info):
        """ Get rekeningen when requested """
        return await request.dataloader.rekeningen_by_gebruiker.load(root.get('id')) or []

    async def resolve_afspraken(root, info):
        return await request.dataloader.afspraken_by_gebruiker.load(root.get('id')) or []
