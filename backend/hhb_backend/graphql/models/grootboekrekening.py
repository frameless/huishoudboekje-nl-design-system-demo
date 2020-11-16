""" Grootboekrekening model as used in GraphQL queries """
import graphene
from flask import request


class Grootboekrekening(graphene.ObjectType):
    """ Grootboekrekening model """
    id = graphene.String(required=True)
    naam = graphene.String()
    referentie = graphene.String()
    omschijving_kort = graphene.String()
    omschijving_lang = graphene.String()
    debet = graphene.Boolean()
    parent = graphene.Field(lambda: Grootboekrekening)
    children = graphene.List(lambda: Grootboekrekening)

    async def resolve_parent(root, info):
        """ Get parent when requested """
        if root.get('parent'):
            return await request.dataloader.grootboekrekeningen_by_id.load(root.get('parent')) or None

    async def resolve_children(root, info):
        """ Get children when requested """
        if root.get('children'):
            children_ = await request.dataloader.grootboekrekeningen_by_id.load_many(root.get('children'))
            return children_ or []
