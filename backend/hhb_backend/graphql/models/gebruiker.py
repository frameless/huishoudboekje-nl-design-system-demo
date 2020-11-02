""" Gebruiker model as used in GraphQL queries """
import os
from datetime import date

import graphene
import requests
from graphql import GraphQLError

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
        response = requests.get(f"{settings.HHB_SERVICES_URL}/gebruikers/{root.get('id')}/rekeningen")
        if response.status_code != 200:
            raise GraphQLError(f"Upstream API responded: {response.json()}")
        return response.json()["data"]

    def resolve_afspraken(root, info):
        data = root.get('afspraken')
        if data == None:
            afspraken_response = requests.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_gebruikers={root.get('id')}")
            if afspraken_response.status_code != 200:
                raise GraphQLError(f"Upstream API responded: {afspraken_response.json()}")
            data = afspraken_response.json()["data"]
        return data
