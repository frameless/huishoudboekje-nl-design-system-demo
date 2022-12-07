""" GraphQl Mutatie voor het verwijderen van een Alarm """
import graphene

import hhb_backend.graphql.models.alarm as graphene_alarm
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.mutations.alarmen.alarm import AlarmHelper
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity


class DeleteAlarm(graphene.Mutation):
    class Arguments:
        id = graphene.String(required=True)

    ok = graphene.Boolean()
    previous = graphene.Field(lambda: graphene_alarm.Alarm)
    burger_id = graphene.String(default_value="")

    @staticmethod
    def mutate(self, info, id):
        """ Mutatie voor het verwijderen van een bestaand Alarm """
        result = AlarmHelper.delete(id)

        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="alarm", entityId=id),
                GebruikersActiviteitEntity(entityType="afspraak", entityId=result.previous.afspraakId),
                GebruikersActiviteitEntity(entityType="burger", entityId=result.burger_id)
            ],
            before=dict(alarm=result.previous),
        )

        return DeleteAlarm(ok=True, previous=result.previous, burger_id=result.burger_id)
