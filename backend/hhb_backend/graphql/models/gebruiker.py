""" Gebruiker model as used in GraphQL queries """
import os
from datetime import date

import graphene
import requests

from hhb_backend.graphql import settings
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

    def resolve_rekeningen(root, info):
        """ Get rekeningen when requested """

        return [
            {
                "iban": "1",
                "rekeninghouder": "a",
            },
            {
                "iban": "2",
                "rekeninghouder": "a en/of b",
            }
        ]

    def resolve_afspraken(root, info):
        """ Get afspraken when requested """

        return [
            {
                "id": 1,
                "gebruiker_id": root.get('id'),
                "beschrijving": "Beschrijving",
                "start_datum": date.fromisoformat("2020-10-01"),
                "eind_datum": None,
                "aantal_betalingen": 1,
                "interval": None,
                "tegen_rekening_id": 1,
                "bedrag": "1000.00",
                "credit": False,
                "kenmerk": "Kenmerk",
                "actief": True,
            },
        ]
