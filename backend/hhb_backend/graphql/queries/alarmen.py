""" GraphQL Alarmen query """
import graphene

from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.Alarm import Alarm
from hhb_backend.graphql.utils.gebruikersactiviteiten import (gebruikers_activiteit_entities, log_gebruikers_activiteit)


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
        return hhb_dataloader().alarm_by_id.load(id)


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
            return hhb_dataloader().alarm_by_id.load_many(ids)
        return hhb_dataloader().alarmen.load_all()
