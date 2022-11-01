""" GraphQL Alarmen query """
import graphene

from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.alarm import Alarm
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
    def resolver(cls, _root, _info, id):
        return hhb_dataloader().alarms.load_one(id)


class AlarmenQuery:
    return_type = graphene.List(Alarm, ids=graphene.List(graphene.String))

    @classmethod
    def gebruikers_activiteit(cls, _root, info, ids, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(entity_type="alarm", result=ids),
        )

    @classmethod
    @log_gebruikers_activiteit
    def resolver(cls, _root, _info, ids=None):
        if ids:
            return hhb_dataloader().alarms.load(ids)
        return hhb_dataloader().alarms.load_all()
