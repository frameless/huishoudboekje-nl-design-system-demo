""" GraphQl Mutatie voor het aanpassen van een Alarm """
import logging
import graphene

import hhb_backend.graphql.models.alarm as graphene_alarm
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.mutations.alarmen.alarm import AlarmHelper, UpdateAlarmInput
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity


class UpdateAlarm(graphene.Mutation):
    class Arguments:
        id = graphene.String(required=True)
        input = graphene.Argument(UpdateAlarmInput, required=True)

    ok = graphene.Boolean()
    alarm = graphene.Field(lambda: graphene_alarm.Alarm)
    previous = graphene.Field(lambda: graphene_alarm.Alarm)
    burger_id = graphene.String(default_value="")

    @staticmethod
    def mutate(self, info, id: str, input: UpdateAlarmInput):
        """ Mutatie voor het wijzigen van een bestaand Alarm """
        logging.info(f"Updating alarm {id}")
        response_alarm = AlarmHelper.update(id, input)

        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="alarm", entityId=id),
                GebruikersActiviteitEntity(entityType="afspraak", entityId=response_alarm.alarm["afspraakId"]),
                GebruikersActiviteitEntity(entityType="burger", entityId=response_alarm.burger_id)
            ],
            before=dict(alarm=response_alarm.previous),
            after=dict(alarm=response_alarm.alarm),
        )

        return UpdateAlarm(
            alarm=response_alarm.alarm,
            previous=response_alarm.previous,
            ok=True,
            burger_id=response_alarm.burger_id
        )
