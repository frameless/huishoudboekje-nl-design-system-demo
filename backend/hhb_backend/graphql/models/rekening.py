""" Rekening model as used in GraphQL queries """
import graphene

import hhb_backend.graphql.models.afdeling as afdeling
import hhb_backend.graphql.models.afspraak as afspraak
import hhb_backend.graphql.models.burger as burger
from hhb_backend.graphql.dataloaders import hhb_dataloader


class Rekening(graphene.ObjectType):
    id = graphene.Int()
    iban = graphene.String()
    rekeninghouder = graphene.String()
    burgers = graphene.List(lambda: burger.Burger)
    afdelingen = graphene.List(lambda: afdeling.Afdeling)
    afspraken = graphene.List(lambda: afspraak.Afspraak)

    async def resolve_burgers(self, info):
        """ Get burgers when requested """
        if self.get('burgers'):
            return hhb_dataloader().burger_by_id.load_many(self.get('burgers')) or []

    async def resolve_afdelingen(self, info):
        """ Get afdelingen when requested """
        if self.get('afdelingen'):
            return hhb_dataloader().afdeling_by_id.load_many(self.get('afdelingen')) or []
    
    async def resolve_afspraken(self, info):
        """ Get afspraken when requested """
        if self.get('afspraken'):
            return hhb_dataloader().afspraak_by_id.load_many(self.get('afspraken')) or []