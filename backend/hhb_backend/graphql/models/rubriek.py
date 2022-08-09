""" Rubriek model as used in GraphQL queries """
import graphene

import hhb_backend.graphql.models.grootboekrekening as grootboekrekening
from hhb_backend.graphql.dataloaders import hhb_dataloader


class Rubriek(graphene.ObjectType):
    id = graphene.Int()
    naam = graphene.String()
    grootboekrekening = graphene.Field(lambda: grootboekrekening.Grootboekrekening)

    async def resolve_grootboekrekening(self, _info):
        """ Get gebruikers when requested """
        if self.get('grootboekrekening_id'):
            return hhb_dataloader().grootboekrekeningen_by_id.load(self.get('grootboekrekening_id')) or []
