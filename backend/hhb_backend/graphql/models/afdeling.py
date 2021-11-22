import graphene
from flask import request
import hhb_backend.graphql.models.afspraak as afspraak
import hhb_backend.graphql.models.organisatie as organisatie
import hhb_backend.graphql.models.rekening as rekening
import hhb_backend.graphql.models.postadres as postadres
from hhb_backend.graphql import settings
import requests

class Afdeling(graphene.ObjectType): 
    id = graphene.Int()
    naam = graphene.String()
    organisatie = graphene.Field(lambda: organisatie.Organisatie)
    rekeningen = graphene.List(lambda: rekening.Rekening)
    postadressen = graphene.List(lambda: postadres.Postadres)
    afspraken = graphene.List(lambda: afspraak.Afspraak)

    async def resolve_rekeningen(root, info):
        """ Get rekeningen when requested """
        return await request.dataloader.rekeningen_by_afdeling.load(root.get('id')) or []

    async def resolve_organisatie(root, info):
        return await request.dataloader.organisaties_by_id.load(root.get('organisatie_id'))

    async def resolve_postadressen(root, info):
        ids = root.get('postadressen_ids')
        if not ids:
            return []
        querystring = f"?id[]={'&id[]='.join([str(k) for k in ids])}" if ids else ''
        url = f"""{settings.CONTACTCATALOGUS_SERVICE_URL}/addresses/{querystring}"""
        response = requests.get(url, headers={"Accept" : "application/json", "Authorization": "45c1a4b6-59d3-4a6e-86bf-88a872f35845"})

        iterable = []
        for post in response.json():
            iterable.append(post)
        return iterable
       

    async def resolve_afspraken(root, info):
        afdeling_id = root.get('id')
        return await request.dataloader.afspraken_by_afdeling.load(afdeling_id) or []