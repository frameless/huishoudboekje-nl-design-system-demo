""" Organisatie model as used in GraphQL queries """
import os
import graphene
import requests
from graphql import GraphQLError
from hhb_backend.graphql import settings
import hhb_backend.graphql.models.afspraak as afspraak
import hhb_backend.graphql.models.rekening as rekening


class OrganisatieKvK(graphene.ObjectType):
    nummer = graphene.String()
    naam = graphene.String()
    straatnaam = graphene.String()
    huisnummer = graphene.String()
    postcode = graphene.String()
    plaatsnaam = graphene.String()

    def resolve_nummer(root, info):
        return root.get("kvk_nummer")


class Organisatie(graphene.ObjectType):
    """ GraphQL Organisatie model """
    id = graphene.Int()
    weergave_naam = graphene.String()
    rekeningen = graphene.List(lambda: rekening.Rekening)
    afspraken = graphene.List(lambda: afspraak.Afspraak)
    kvk_nummer = graphene.String()
    kvk_details = graphene.Field(OrganisatieKvK)

    def resolve_kvk_details(root, info):
        """ Get KvK Details when requested """
        response = requests.get(
            os.path.join(settings.ORGANISATIE_SERVICES_URL, f"organisaties/{root.get('kvk_nummer')}")
        )
        if response.status_code == 200:
            print(response.json()["data"])
            return response.json()["data"]
        elif response.status_code == 404:
            return None
        else:
            raise GraphQLError(f"Upstream API responded: {response.json()}")

    def resolve_rekeningen(root, info):
        return [
            {
                "iban": "12",
                "rekeninghouder": "A",
            }
        ]

    def resolve_afspraken(root, info):
        """ Get afspraken when requested """

        return [
            {
                "id": 1,
                "gebruiker_id": 1,
                "beschrijving": "Beschrijving",
                "start_datum": "2020-10-01",
                "eind_datum": None,
                "aantal_betalingen": 1,
                "interval": None,
                "tegen_rekening_id": 12,
                "bedrag": "1000.00",
                "credit": False,
                "kenmerk": "Kenmerk",
                "actief": True,
            }
        ]
