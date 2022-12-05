""" GraphQL mutatie voor het aanmaken van een Alarm """
import graphene

import hhb_backend.graphql.models.alarm as graphene_alarm
from hhb_backend.graphql.mutations.alarmen.alarm import AlarmHelper, CreateAlarmInput
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity
from hhb_backend.audit_logging import AuditLogging

class CreateAlarm(graphene.Mutation):
    class Arguments:
        input = graphene.Argument(CreateAlarmInput, required=True)

    ok = graphene.Boolean()
    alarm = graphene.Field(lambda: graphene_alarm.Alarm)
    burger_id = graphene.String(default_value="")

    @staticmethod
    def mutate(self, info, input: CreateAlarmInput):
        """ Mutatie voor het aanmaken van een nieuw Alarm """
        response_alarm = AlarmHelper.create(input)

        AuditLogging.create(
            action=info.field_name,
            entities=(
                GebruikersActiviteitEntity(entityType="alarm", entityId=response_alarm.alarm["id"]),
                GebruikersActiviteitEntity(entityType="afspraak", entityId=response_alarm.alarm["afspraakId"]),
                GebruikersActiviteitEntity(entityType="burger", entityId=response_alarm.burger_id)
            ),
            after=dict(alarm=response_alarm.alarm),
        )

        return CreateAlarm(alarm=response_alarm.alarm, burger_id=response_alarm.burger_id, ok=True)
