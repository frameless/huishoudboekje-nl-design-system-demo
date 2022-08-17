""" GraphQL Grootboekrekening query """
import graphene

from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.grootboekrekening import Grootboekrekening
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
    log_gebruikers_activiteit,
)


class GrootboekrekeningQuery:
    return_type = graphene.Field(Grootboekrekening, id=graphene.String(required=True))

    @classmethod
    def gebruikers_activiteit(cls, _root, info, id, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="grootboekrekening", result=id
            ),
        )

    @classmethod
    @log_gebruikers_activiteit
    async def resolver(cls, _root, _info, id):
        return hhb_dataloader().grootboekrekening_by_id.load(id)


class GrootboekrekeningenQuery:
    return_type = graphene.List(
        Grootboekrekening, ids=graphene.List(graphene.String, default_value=[])
    )

    @classmethod
    def gebruikers_activiteit(cls, _root, info, ids, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="grootboekrekening", result=ids
            ),
        )

    @classmethod
    @log_gebruikers_activiteit
    async def resolver(cls, _root, _info, ids=None):
        if ids:
            return hhb_dataloader().grootboekrekening_by_id.load_many(ids)
        return hhb_dataloader().grootboekrekening_by_id.load_all()
