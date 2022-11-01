""" Organisatie model as used in GraphQL queries """

import graphene
from graphql import GraphQLError

import hhb_backend.graphql.models.afdeling as afdeling
from hhb_backend.graphql.dataloaders import hhb_dataloader


class Organisatie(graphene.ObjectType):
    id = graphene.Int()
    naam = graphene.String()
    kvknummer = graphene.String()
    vestigingsnummer = graphene.String()
    afdelingen = graphene.List(lambda: afdeling.Afdeling)

    def resolve_afdelingen(root, _info):
        return hhb_dataloader().afdelingen.by_organisatie(root.get('id')) or []

    @staticmethod
    def check_kvk_vestigingsnummer(kvknummer, vestigingsnummer, id=None):
        organisaties = hhb_dataloader().organisaties.load_all()
        if kvknummer and not vestigingsnummer:
            for organisatie in organisaties:
                if id == organisatie.id:
                    vestigingsnummer = organisatie.vestigingsnummer
        elif vestigingsnummer and not kvknummer:
            for organisatie in organisaties:
                if id == organisatie.id:
                    kvknummer = organisatie.kvknummer

        for organisatie in organisaties:
            if id == organisatie.id:
                continue
            if str(kvknummer) == str(organisatie.kvknummer):
                if str(vestigingsnummer) == str(organisatie.vestigingsnummer):
                    raise GraphQLError("Combination kvk-nummer and vestigingsnummer is not unique.")

    @staticmethod
    def unique_kvk_vestigingsnummer(kvknummer, vestigingsnummer, id=None):
        if id is None:
            id = 1

        if vestigingsnummer or kvknummer:
            Organisatie.check_kvk_vestigingsnummer(kvknummer, vestigingsnummer, id)
