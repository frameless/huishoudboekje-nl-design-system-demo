import graphene
from flask import request
import hhb_backend.graphql.models.afspraak as afspraak
import hhb_backend.graphql.models.organisatie as organisatie
import hhb_backend.graphql.models.rekening as rekening
import hhb_backend.graphql.models.postadres as postadres
from graphql import GraphQLError

class Afdeling(graphene.ObjectType):
    """ GraphQL Afdeling model """
    id = graphene.Int()
    naam = graphene.String()
    organisatie = graphene.Field(lambda: organisatie.Organisatie)
    afspraken = graphene.List(lambda: afspraak.Afspraak)
    rekeningen = graphene.List(lambda: rekening.Rekening)
    postadressen = graphene.List(lambda: postadres.Postadres)

    async def resolve_rekeningen(root, info):
        """ Get rekeningen when requested """
        return await request.dataloader.rekeningen_by_afdeling.load(root.get('id')) or []

    async def resolve_organisatie(root, info):
        return await request.dataloader.organisaties_by_id.load(root.get('organisatie_id'))

    async def resolve_postadressen(root, info):
        return await request.dataloader.postadressen_by_id.auth_load_many(root.get('postadressen_ids')) or []

    async def resolve_afspraken(root, info):
        return await request.dataloader.afspraken_by_afdeling.load(root.get('id')) or []