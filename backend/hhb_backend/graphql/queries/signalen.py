""" GraphQL Signalen query """
import graphene
from hhb_backend.graphql.utils.gebruikersactiviteiten import (gebruikers_activiteit_entities, log_gebruikers_activiteit)
from hhb_backend.graphql.models.signaal import Signaal
from flask import request

class SignaalQuery:
    return_type = graphene.Field(Signaal, id=graphene.String(required=True))

    @classmethod
    def gebruikers_activiteit(cls, _root, info, id, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(entity_type="signaal", result=id),
        )

    @classmethod
    @log_gebruikers_activiteit
    async def resolver(cls, _root, _info, id):

        signaal = await request.dataloader.signalen_by_id.load(id)
        return signaal


class SignalenQuery:
    return_type = graphene.List(Signaal, ids=graphene.List(graphene.String, default_value=[]))

    @classmethod
    def gebruikers_activiteit(cls, _root, info, ids, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(entity_type="signaal", result=ids),
        )

    @classmethod
    @log_gebruikers_activiteit
    async def resolver(cls, _root, _info, ids=None):
        if ids:
            signaal = await request.dataloader.signalen_by_id.load_many(ids)
            return signaal

        signaal = request.dataloader.signalen_by_id.get_all_and_cache()
        return signaal