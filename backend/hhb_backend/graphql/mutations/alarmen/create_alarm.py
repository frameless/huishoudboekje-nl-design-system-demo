""" GraphQL mutatie voor het aanmaken van een Alarm """
import graphene

import hhb_backend.graphql.models.alarm as graphene_alarm
from hhb_backend.graphql.mutations.alarmen.alarm import AlarmHelper, CreateAlarmInput
from hhb_backend.graphql.utils.gebruikersactiviteiten import log_gebruikers_activiteit, gebruikers_activiteit_entities

class CreateAlarm(graphene.Mutation):
    class Arguments:
        input = graphene.Argument(CreateAlarmInput, required=True)

    ok = graphene.Boolean()
    alarm = graphene.Field(lambda: graphene_alarm.Alarm)
    burger_id = graphene.String(default_value="")

    def gebruikers_activiteit(self, _root, _info, *_args, **_kwargs):
        data = dict(
            action=_info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="alarm", result=self, key="alarm"
            ) + gebruikers_activiteit_entities(
                entity_type="afspraak", result=self.alarm, key="afspraakId"
            ) + gebruikers_activiteit_entities(
                entity_type="burger", result=self, key="burger_id"
            ),
            after=dict(alarm=self.alarm),
        )
        i = _info.field_name.find("-")
        _info.field_name = _info.field_name[:i].strip()
        return data

    @staticmethod
    @log_gebruikers_activiteit
    def mutate(_root, _info, input: CreateAlarmInput):
        """ Mutatie voor het aanmaken van een nieuw Alarm """
        response_alarm = AlarmHelper.create(input)

        return CreateAlarm(alarm=response_alarm.alarm, burger_id=response_alarm.burger_id, ok=True)
