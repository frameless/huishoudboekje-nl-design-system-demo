""" GraphQL Journaalpost query """
import graphene
from flask import request

from hhb_backend.graphql.models.journaalpost import Journaalpost
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
    log_gebruikers_activiteit,
)


class JournaalpostQuery:
    return_type = graphene.Field(Journaalpost, id=graphene.Int(required=True))

    @classmethod
    def gebruikers_activiteit(cls, _root, info, id, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="journaalpost", result=id
            ),
        )

    @classmethod
    @log_gebruikers_activiteit
    async def resolver(cls, _root, _info, id):
        return await request.dataloader.journaalposten_by_id.load(id)


class JournaalpostenQuery:
    return_type = graphene.List(
        Journaalpost, ids=graphene.List(graphene.Int, default_value=[])
    )

    @classmethod
    def gebruikers_activiteit(cls, _root, info, ids, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="journaalpost", result=ids
            ),
        )

    @classmethod
    @log_gebruikers_activiteit
    async def resolver(cls, _root, _info, ids=None):
        if ids:
            return await request.dataloader.journaalposten_by_id.load_many(ids)
        return request.dataloader.journaalposten_by_id.get_all_and_cache()
