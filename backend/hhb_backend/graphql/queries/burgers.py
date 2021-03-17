""" GraphQL Burgers query """
import graphene
from flask import request

import hhb_backend.graphql.models.burger as burger
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
    log_gebruikers_activiteit,
)


class BurgerQuery:
    return_type = graphene.Field(burger.Burger, id=graphene.Int(required=True))

    @classmethod
    def gebruikers_activiteit(cls, _root, info, id, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(entity_type="burger", result=id),
        )

    @classmethod
    @log_gebruikers_activiteit
    async def resolver(cls, _root, _info, id, *_args, **_kwargs):
        return await request.dataloader.burgers_by_id.load(id)


class BurgersQuery:
    return_type = graphene.List(
        burger.Burger, ids=graphene.List(graphene.Int, default_value=[])
    )

    @classmethod
    def gebruikers_activiteit(cls, _root, info, ids, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(entity_type="burger", result=ids),
        )

    @classmethod
    @log_gebruikers_activiteit
    async def resolver(cls, _root, _info, ids=None):
        if ids:
            return await request.dataloader.burgers_by_id.load_many(ids)
        return request.dataloader.burgers_by_id.get_all_and_cache()