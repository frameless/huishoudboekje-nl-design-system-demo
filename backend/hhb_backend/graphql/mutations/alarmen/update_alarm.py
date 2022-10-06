""" GraphQl Mutatie voor het aanpassen van een Alarm """
import graphene

from hhb_backend.graphql.models.alarm import Alarm
from hhb_backend.graphql.mutations.alarmen.alarm import AlarmHelper, UpdateAlarmInput
from hhb_backend.graphql.utils.gebruikersactiviteiten import log_gebruikers_activiteit, gebruikers_activiteit_entities


class UpdateAlarm(graphene.Mutation):
    class Arguments:
        id = graphene.String(required=True)
        input = graphene.Argument(UpdateAlarmInput, required=True)

    ok = graphene.Boolean()
    alarm = graphene.Field(lambda: Alarm)
    previous = graphene.Field(lambda: Alarm)
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
            before=dict(alarm=self.previous),
            after=dict(alarm=self.alarm),
        )
        i = _info.field_name.find("-")
        _info.field_name = _info.field_name[:i].strip()
        return data


    @staticmethod
    @log_gebruikers_activiteit
    async def mutate(_root, _info, id: str, input: UpdateAlarmInput):
        """ Mutatie voor het wijzigen van een bestaand Alarm """
        response_alarm = await AlarmHelper.update(id, input)

        return UpdateAlarm(alarm=response_alarm.alarm, previous=response_alarm.previous, ok=True, burger_id=response_alarm.burger_id)
