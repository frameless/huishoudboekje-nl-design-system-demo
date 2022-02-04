""" GraphQL Alarmen query """
import graphene
from hhb_backend.graphql.utils.gebruikersactiviteiten import (gebruikers_activiteit_entities, log_gebruikers_activiteit)
from hhb_backend.graphql.models.Alarm import Alarm
from flask import request

class AlarmQuery:
    return_type = graphene.Field(Alarm, id=graphene.String(required=True))

    @classmethod
    def gebruikers_activiteit(cls, _root, info, id, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(entity_type="alarm", result=id),
        )

    @classmethod
    @log_gebruikers_activiteit
    async def resolver(cls, _root, _info, id):

        alarm = await request.dataloader.alarmen_by_id.load(id)
        return alarm


class AlarmenQuery:
    return_type = graphene.List(Alarm, ids=graphene.List(graphene.String, default_value=[]))

    @classmethod
    def gebruikers_activiteit(cls, _root, info, ids, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(entity_type="alarm", result=ids),
        )

    @classmethod
    @log_gebruikers_activiteit
    async def resolver(cls, _root, _info, ids=None):
        if ids:
            alarm = await request.dataloader.alarmen_by_id.load_many(ids)
            return alarm

        alarm = request.dataloader.alarmen_by_id.get_all_and_cache()
        return alarm