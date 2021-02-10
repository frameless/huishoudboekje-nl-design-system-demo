""" GraphQL Rekeningen query """
import graphene
from flask import request

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
    async def resolver(cls, _root, _info, id):
        return await request.dataloader.rekeningen_by_id.load(id)


class RekeningenQuery:
    return_type = graphene.List(
        Rekening, ids=graphene.List(graphene.Int, default_value=[])
    )

    @classmethod
    def gebruikers_activiteit(cls, _root, info, ids, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(entity_type="rekening", result=ids),
        )

    @classmethod
    @log_gebruikers_activiteit
    async def resolver(cls, _root, _info, ids=None):
        if ids:
            return await request.dataloader.rekeningen_by_id.load_many(ids)
        return request.dataloader.rekeningen_by_id.get_all_and_cache()
