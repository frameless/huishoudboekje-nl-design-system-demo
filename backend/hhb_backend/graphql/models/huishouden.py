import graphene
from flask import request

import hhb_backend.graphql.models.burger as burger


class Huishouden(graphene.ObjectType):
    """ GraphQL Huishouden model """
    id = graphene.Int()

    burgers = graphene.List(lambda: burger.Burger)

    async def resolve_burgers(root, info):
        burgers = await request.dataloader.burgers_by_id.load_many(root.get('burgers'))
        return burgers
