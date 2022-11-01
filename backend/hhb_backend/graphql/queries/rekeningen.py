""" GraphQL Rekeningen query """
import graphene

from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.rekening import Rekening
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
    log_gebruikers_activiteit,
)


class RekeningQuery:
    return_type = graphene.Field(Rekening, id=graphene.Int(required=True))

    @classmethod
    def gebruikers_activiteit(cls, _root, info, id, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(entity_type="rekening", result=id),
        )

    @classmethod
    @log_gebruikers_activiteit
    def resolver(cls, _root, _info, id):
        return hhb_dataloader().rekeningen.load_one(id)


class RekeningenQuery:
    return_type = graphene.List(
        Rekening, ids=graphene.List(graphene.Int)
    )

    @classmethod
    def gebruikers_activiteit(cls, _root, info, ids, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(entity_type="rekening", result=ids),
        )

    @classmethod
    @log_gebruikers_activiteit
    def resolver(cls, _root, _info, ids=None):
        if ids:
            return hhb_dataloader().rekeningen.load(ids)
        return hhb_dataloader().rekeningen.load_all()
