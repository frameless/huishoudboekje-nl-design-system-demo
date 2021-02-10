import graphene
from flask import request

from hhb_backend.graphql.models.configuratie import Configuratie
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
    log_gebruikers_activiteit,
)


class ConfiguratieQuery:
    return_type = graphene.Field(Configuratie, id=graphene.String(required=True))

    @classmethod
    def gebruikers_activiteit(cls, _root, info, id, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="configuratie", result=id
            ),
        )

    @classmethod
    @log_gebruikers_activiteit
    async def resolver(cls, _root, _info, id):
        return await request.dataloader.configuratie_by_id.load(id)


class ConfiguratiesQuery:
    return_type = graphene.List(
        Configuratie, ids=graphene.List(graphene.String, default_value=[])
    )

    @classmethod
    def gebruikers_activiteit(cls, _root, info, ids, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="configuratie", result=ids
            ),
        )

    @classmethod
    @log_gebruikers_activiteit
    async def resolver(cls, _root, _info, ids=None):
        if ids:
            return await request.dataloader.configuratie_by_id.load_many(ids)
        return request.dataloader.configuratie_by_id.get_all_and_cache()
