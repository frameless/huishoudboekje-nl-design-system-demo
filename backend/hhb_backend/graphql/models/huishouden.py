import graphene

import hhb_backend.graphql.models.burger as burger
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.pageinfo import PageInfo


class Huishouden(graphene.ObjectType):
    id = graphene.Int()
    burgers = graphene.List(lambda: burger.Burger)

    def resolve_burgers(self, _info):
        return hhb_dataloader().burgers.by_huishouden(self.get('id')) or []


class HuishoudensPaged(graphene.ObjectType):
    huishoudens = graphene.List(Huishouden)
    page_info = graphene.Field(lambda: PageInfo)
