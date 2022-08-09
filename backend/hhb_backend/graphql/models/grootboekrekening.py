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

    async def resolve_parent(root, info):
        """ Get parent when requested """
        if root.get('parent_id'):
            parent = hhb_dataloader().grootboekrekeningen_by_id.load(root.get('parent_id'))
            return parent or None

    async def resolve_children(root, info):
        """ Get children when requested """
        if root.get('children'):
            children_ = hhb_dataloader().grootboekrekeningen_by_id.load_many(root.get('children'))
            return children_ or []

    async def resolve_rubriek(root, info):
        return hhb_dataloader().rubrieken_by_grootboekrekening.load(root.get('id'))

    def resolve_credit(root, info):
        return not root.get('debet')
