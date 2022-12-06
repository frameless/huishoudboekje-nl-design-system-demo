""" GraphQL Alarmen query """
import graphene

from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.alarm import Alarm
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity


class AlarmQuery:
    return_type = graphene.Field(Alarm, id=graphene.String(required=True))

    @classmethod
    def resolver(cls, _, info, id):
        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="alarm", entityId=id)
            ],
        )
        return hhb_dataloader().alarms.load_one(id)


class AlarmenQuery:
    return_type = graphene.List(Alarm, ids=graphene.List(graphene.String))

    @classmethod
    def resolver(cls, _, info, ids=None):
        if ids:
            result = hhb_dataloader().alarms.load(ids)
        else:
            result = hhb_dataloader().alarms.load_all()

        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="alarm", entityId=id)
                for id in ids
            ] if ids else []
        )
        return result
