""" GraphQL mutatie voor het aanmaken van een Alarm """
import graphene

from hhb_backend.graphql.models.alarm import Alarm
from hhb_backend.graphql.mutations.alarmen.alarm import AlarmHelper, CreateAlarmInput


class CreateAlarm(graphene.Mutation):
    class Arguments:
        input = graphene.Argument(CreateAlarmInput, required=True)

    ok = graphene.Boolean()
    alarm = graphene.Field(lambda: Alarm)

    @staticmethod
    async def mutate(_root, _info, input: CreateAlarmInput):
        """ Mutatie voor het aanmaken van een nieuw Alarm """
        response_alarm = await AlarmHelper.create(_root, _info, input)
        
        return CreateAlarm(alarm=response_alarm.alarm, ok=True)
