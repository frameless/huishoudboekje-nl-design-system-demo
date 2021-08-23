""" Organisatie model as used in GraphQL queries """
import graphene
from flask import request
import hhb_backend.graphql.models.afspraak as afspraak
import hhb_backend.graphql.models.rekening as rekening
from graphql import GraphQLError


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
    rekeningen = graphene.List(lambda: rekening.Rekening)
    kvk_nummer = graphene.String()
    kvk_details = graphene.Field(OrganisatieKvK)
    afspraken =  graphene.List(lambda: afspraak.Afspraak)

    vestigingsnummer = graphene.String()

    async def resolve_kvk_details(root, info):
        """ Get KvK Details when requested """
        return await request.dataloader.organisaties_kvk_details.load(root.get('id'))

    async def resolve_rekeningen(root, info):
        return await request.dataloader.rekeningen_by_organisatie.load(root.get('id')) or []

    async def resolve_afspraken(root, info):
        return await request.dataloader.afspraken_by_id.load_many(root.get('afspraken')) or []

    def check_kvk_vestigingsnummer(self, kvk_nummer, vestigingsnummer, id=None):
        organisaties = request.dataloader.organisaties_by_id.get_all_and_cache()

        if kvk_nummer and not vestigingsnummer:
            for organisatie in organisaties:
                if id == organisatie.get('id'):
                    current = organisatie
            vestigingsnummer = current['vestigingsnummer']
        elif vestigingsnummer and not kvk_nummer:
            for organisatie in organisaties:
                if id == organisatie.get('id'):
                    current = organisatie
            kvk_nummer = current['kvk_nummer']

        for organisatie in organisaties:
            if id == organisatie['id']:
                continue
            if kvk_nummer == organisatie['kvk_nummer']:
                if vestigingsnummer == organisatie['vestigingsnummer']:
                    raise GraphQLError("Combination kvk-nummer and vestigingsnummer is not unique.")

    def unique_kvk_vestigingsnummer(self, kvk_nummer, vestigingsnummer, id=None):
        if vestigingsnummer and not id:
            self.check_kvk_vestigingsnummer(kvk_nummer, vestigingsnummer, id)
        elif id:
            if vestigingsnummer and kvk_nummer:
                self.check_kvk_vestigingsnummer(kvk_nummer, vestigingsnummer, id)
            elif vestigingsnummer:
                self.check_kvk_vestigingsnummer(kvk_nummer, vestigingsnummer, id)
            elif kvk_nummer:
                self.check_kvk_vestigingsnummer(kvk_nummer, vestigingsnummer, id)
