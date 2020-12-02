""" Grootboekrekening model as used in GraphQL queries """
import graphene
import requests
from flask import request
from hhb_backend.graphql.models.rubriek import Rubriek
from hhb_backend.graphql import settings

class Grootboekrekening(graphene.ObjectType):
    """ Grootboekrekening model """
    id = graphene.String(required=True)
    naam = graphene.String()
    referentie = graphene.String()
    omschrijving = graphene.String()
    debet = graphene.Boolean()
    parent = graphene.Field(lambda: Grootboekrekening)
    children = graphene.List(lambda: Grootboekrekening)
    rubriek = graphene.Field(lambda: Rubriek)

    async def resolve_parent(root, info):
        """ Get parent when requested """
        if root.get('parent_id'):
            parent = await request.dataloader.grootboekrekeningen_by_id.load(root.get('parent_id'))
            return parent or None

    async def resolve_children(root, info):
        """ Get children when requested """
        if root.get('children'):
            children_ = await request.dataloader.grootboekrekeningen_by_id.load_many(root.get('children'))
            return children_ or []

    def resolve_rubriek(root, info):
        response = requests.get(settings.HHB_SERVICES_URL + "/rubrieken/?filter_grootboekrekeningen=" + root.get('id'))
        if len(response.json()["data"]) > 0:
            return response.json()["data"][0]
        return None
