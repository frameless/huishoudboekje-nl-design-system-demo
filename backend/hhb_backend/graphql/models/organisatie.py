""" Organisatie model as used in GraphQL queries """
import graphene
from flask import request
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
    kvk_nummer = graphene.String()
    kvk_details = graphene.Field(OrganisatieKvK)
    afspraken =  graphene.List(lambda: afspraak.Afspraak)

    async def resolve_kvk_details(root, info):
        """ Get KvK Details when requested """
        return await request.dataloader.organisaties_kvk_details.load(root.get('kvk_nummer'))

    async def resolve_rekeningen(root, info):
        return await request.dataloader.rekeningen_by_organisatie.load(root.get('id')) or []

    async def resolve_afspraken(root, info):
        return await request.dataloader.afspraken_by_id.load_many(root.get('afspraken')) or []
