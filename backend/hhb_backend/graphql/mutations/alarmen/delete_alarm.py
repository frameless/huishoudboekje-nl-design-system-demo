""" GraphQl Mutatie voor het verwijderen van een Alarm """
import graphene

from hhb_backend.graphql.models.alarm import Alarm
from hhb_backend.graphql.mutations.alarmen.alarm import AlarmHelper


class DeleteAlarm(graphene.Mutation):
    class Arguments:
        id = graphene.String(required=True)

    ok = graphene.Boolean()
    previous = graphene.Field(lambda: Alarm)

    @staticmethod
    async def mutate(_root, _info, id):
        """ Mutatie voor het verwijderen van een bestaand Alarm """
        result = await AlarmHelper.delete(_root, _info, id)

        return DeleteAlarm(ok=True, previous=result.previous)
