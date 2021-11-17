""" Rubriek model as used in GraphQL queries """
import graphene
from flask import request
import hhb_backend.graphql.models.grootboekrekening as grootboekrekening

class Rubriek(graphene.ObjectType):
    id = graphene.Int()
    naam = graphene.String()
    grootboekrekening = graphene.Field(lambda: grootboekrekening.Grootboekrekening)

    async def resolve_grootboekrekening(root, info):
        """ Get gebruikers when requested """
        if root.get('grootboekrekening_id'):
            return await request.dataloader.grootboekrekeningen_by_id.load(root.get('grootboekrekening_id')) or []
