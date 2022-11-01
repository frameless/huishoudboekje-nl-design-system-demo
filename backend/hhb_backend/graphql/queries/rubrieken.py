""" GraphQL Rubriek query """
import graphene

from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.rubriek import Rubriek
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
    log_gebruikers_activiteit,
)


class RubriekQuery:
    return_type = graphene.Field(Rubriek, id=graphene.String(required=True))

    @classmethod
    def gebruikers_activiteit(cls, _root, info, id, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(entity_type="rubriek", result=id),
        )

    @classmethod
    @log_gebruikers_activiteit
    def resolver(cls, _root, _info, id):
        return hhb_dataloader().rubrieken.load_one(id)


class RubriekenQuery:
    return_type = graphene.List(
        Rubriek, ids=graphene.List(graphene.String)
    )

    @classmethod
    def gebruikers_activiteit(cls, _root, info, ids=None, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(entity_type="rubriek", result=ids),
        )

    @classmethod
    @log_gebruikers_activiteit
    def resolver(cls, _root, _info, ids=None):
        if ids:
            return hhb_dataloader().rubrieken.load(ids)
        return hhb_dataloader().rubrieken.load_all()
