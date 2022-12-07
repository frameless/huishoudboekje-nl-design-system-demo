""" Grootboekrekening model as used in GraphQL queries """
import graphene

from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.rubriek import Rubriek


class Grootboekrekening(graphene.ObjectType):
    id = graphene.String(required=True)
    naam = graphene.String()
    referentie = graphene.String()
    omschrijving = graphene.String()
    credit = graphene.Boolean()
    parent = graphene.Field(lambda: Grootboekrekening)
    children = graphene.List(lambda: Grootboekrekening)
    rubriek = graphene.Field(lambda: Rubriek)

    def resolve_parent(self, _info):
        """ Get parent when requested """
        if self.get('parent_id'):
            return hhb_dataloader().grootboekrekeningen.load_one(self.get('parent_id'))

    def resolve_children(self, _info):
        """ Get children when requested """
        if self.get('children'):
            return hhb_dataloader().grootboekrekeningen.load(self.get('children')) or []

    def resolve_rubriek(self, _info):
        return hhb_dataloader().rubrieken.by_grootboekrekening(self.get('id'))

    def resolve_credit(self, _info):
        return not self.get('debet')
