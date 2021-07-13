import graphene
from flask import request

import hhb_backend.graphql.models.burger as burger
from hhb_backend.graphql.models.pageinfo import PageInfo


class Huishouden(graphene.ObjectType):
    """ GraphQL Huishouden model """
    id = graphene.Int()
    burgers = graphene.List(lambda: burger.Burger)

    async def resolve_burgers(root, info):
        return await request.dataloader.burgers_by_huishouden.load(root.get('id')) or []



class HuishoudensPaged(graphene.ObjectType):
    huishoudens = graphene.List(Huishouden)
    page_info = graphene.Field(lambda: PageInfo)
