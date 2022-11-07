""" GraphQl Mutatie voor het aanpassen van een Alarm """
import graphene

import hhb_backend.graphql.models.alarm as graphene_alarm
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.mutations.alarmen.alarm import AlarmHelper, UpdateAlarmInput
from hhb_backend.graphql.utils.gebruikersactiviteiten import log_gebruikers_activiteit, gebruikers_activiteit_entities


class UpdateAlarm(graphene.Mutation):
    class Arguments:
        id = graphene.String(required=True)
        input = graphene.Argument(UpdateAlarmInput, required=True)

    ok = graphene.Boolean()
    alarm = graphene.Field(lambda: graphene_alarm.Alarm)
    previous = graphene.Field(lambda: graphene_alarm.Alarm)
    burger_id = graphene.String(default_value="")

    @staticmethod
    def mutate(_root, _info, id: str, input: UpdateAlarmInput):
        """ Mutatie voor het wijzigen van een bestaand Alarm """
        response_alarm = AlarmHelper.update(id, input)

        AuditLogging.create(
            action=_info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="alarm", result=alarm
            ) + gebruikers_activiteit_entities(
                entity_type="afspraak", result=alarm, key="afspraakId"
            ) + gebruikers_activiteit_entities(
                entity_type="burger", result=burger_id
            ),
            before=dict(alarm=previous),
            after=dict(alarm=alarm),
        )

        return UpdateAlarm(
            alarm=response_alarm.alarm,
            previous=response_alarm.previous,
            ok=True,
            burger_id=response_alarm.burger_id
        )
