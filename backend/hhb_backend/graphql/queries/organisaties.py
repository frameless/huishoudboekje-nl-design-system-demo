""" GraphQL Gebruikers query """
import graphene
from flask import request

from hhb_backend.graphql.models.organisatie import Organisatie
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
    log_gebruikers_activiteit,
)


class OrganisatieQuery:
    return_type = graphene.Field(Organisatie, id=graphene.Int(required=True))

    @classmethod
    def gebruikers_activiteit(cls, _root, info, id, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="organisatie", result=id
            ),
        )

    @classmethod
    @log_gebruikers_activiteit
    async def resolver(cls, _root, _info, id):
        return await request.dataloader.organisaties_by_id.load(id)


class OrganisatiesQuery:
    return_type = graphene.List(
        Organisatie, ids=graphene.List(graphene.Int, default_value=[])
    )

    @classmethod
    def gebruikers_activiteit(cls, _root, info, ids, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="organisatie", result=ids
            ),
        )

    @classmethod
    @log_gebruikers_activiteit
    async def resolver(cls, _root, _info, ids=None):
        if ids:
            return await request.dataloader.organisaties_by_id.load_many(ids)
        return request.dataloader.organisaties_by_id.get_all_and_cache()
