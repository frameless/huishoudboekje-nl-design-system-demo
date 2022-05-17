""" GraphQl Mutatie voor het aanpassen van een Alarm """
import graphene
from hhb_backend.graphql.mutations.alarmen.alarm import AlarmHelper, UpdateAlarmInput
from hhb_backend.graphql.models.Alarm import Alarm


class UpdateAlarm(graphene.Mutation):
    class Arguments:
        id = graphene.String(required=True)
        input = graphene.Argument(UpdateAlarmInput, required=True)

    ok = graphene.Boolean()
    alarm = graphene.Field(lambda: Alarm)
    previous = graphene.Field(lambda: Alarm)


    @staticmethod
    async def mutate(_root, _info, id: str, input: UpdateAlarmInput):
        """ Mutatie voor het wijzigen van een bestaand Alarm """
        response_alarm = await AlarmHelper.update(_root, _info, id, input)

        return UpdateAlarm(alarm=response_alarm.get_alarm(), previous=response_alarm.get_previous(), ok=True)