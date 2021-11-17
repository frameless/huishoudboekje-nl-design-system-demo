""" Organisatie model as used in GraphQL queries """
import graphene
from flask import request
from graphql import GraphQLError
import hhb_backend.graphql.models.afdeling as afdeling

class Organisatie(graphene.ObjectType):
    id = graphene.Int()
    naam = graphene.String()
    kvknummer = graphene.String()
    vestigingsnummer = graphene.String()
    afdelingen = graphene.List(lambda: afdeling.Afdeling)

    async def resolve_afdelingen(root, info):
        return await request.dataloader.afdelingen_by_organisatie.load(root.get('id')) or []

    def check_kvk_vestigingsnummer(self, kvknummer, vestigingsnummer, id=None):
        organisaties = request.dataloader.organisaties_by_id.get_all_and_cache()
        if kvknummer and not vestigingsnummer:
            for organisatie in organisaties:
                if id == organisatie.get('id'):
                    current = organisatie
                    vestigingsnummer = current['vestigingsnummer']
        elif vestigingsnummer and not kvknummer:
            for organisatie in organisaties:
                if id == organisatie.get('id'):
                    current = organisatie
                    kvknummer = current['kvknummer']

        for organisatie in organisaties:
            if id == organisatie['id']:
                continue
            if str(kvknummer) == str(organisatie['kvknummer']):
                if str(vestigingsnummer) == str(organisatie['vestigingsnummer']):
                    raise GraphQLError("Combination kvk-nummer and vestigingsnummer is not unique.")

    def unique_kvk_vestigingsnummer(self, kvknummer, vestigingsnummer, id=None):
        if vestigingsnummer and not id:
            self.check_kvk_vestigingsnummer(kvknummer, vestigingsnummer, 1)
        elif id:
            if vestigingsnummer and kvknummer:
                self.check_kvk_vestigingsnummer(kvknummer, vestigingsnummer, id)
            elif vestigingsnummer:
                self.check_kvk_vestigingsnummer(kvknummer, vestigingsnummer, id)
            elif kvknummer:
                self.check_kvk_vestigingsnummer(kvknummer, vestigingsnummer, id)
