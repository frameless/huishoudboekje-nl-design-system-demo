import graphene

import hhb_backend.graphql.models.burger as burger
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.pageinfo import PageInfo


class Huishouden(graphene.ObjectType):
    id = graphene.Int()
    burgers = graphene.List(lambda: burger.Burger)

    async def resolve_burgers(root, info):
        return hhb_dataloader().burgers_by_huishouden.load(root.get('id')) or []


class HuishoudensPaged(graphene.ObjectType):
    huishoudens = graphene.List(Huishouden)
    page_info = graphene.Field(lambda: PageInfo)
