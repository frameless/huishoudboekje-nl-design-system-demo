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

    def resolve_burgers(self, info):
        """ Get burgers when requested """
        if self.get('burgers'):
            return hhb_dataloader().burgers.load(self.get('burgers')) or []

    def resolve_afdelingen(self, info):
        """ Get afdelingen when requested """
        if self.get('afdelingen'):
            return hhb_dataloader().afdelingen.load(self.get('afdelingen')) or []
    
    def resolve_afspraken(self, info):
        """ Get afspraken when requested """
        if self.get('afspraken'):
            return hhb_dataloader().afspraken.load(self.get('afspraken')) or []