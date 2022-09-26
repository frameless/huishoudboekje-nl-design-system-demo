""" GraphQl Mutatie voor het verwijderen van een Alarm """
import graphene

from hhb_backend.graphql.models.alarm import Alarm
from hhb_backend.graphql.mutations.alarmen.alarm import AlarmHelper
from hhb_backend.graphql.utils.gebruikersactiviteiten import log_gebruikers_activiteit, gebruikers_activiteit_entities


class DeleteAlarm(graphene.Mutation):
    class Arguments:
        id = graphene.String(required=True)

    ok = graphene.Boolean()
    previous = graphene.Field(lambda: Alarm)
    burger_id = graphene.String(default_value="")

    def gebruikers_activiteit(self, _root, _info, *_args, **_kwargs):
        data = dict(
            action=_info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="alarm", result=self, key="previous"
            ) + gebruikers_activiteit_entities(
                entity_type="afspraak", result=dict(self.previous), key="afspraakId"
            ) + gebruikers_activiteit_entities(
                entity_type="burger", result=self, key="burger_id"
            ),
            before=dict(alarm=self.previous),
        )
        i = _info.field_name.find("-")
        _info.field_name = _info.field_name[:i].strip()
        return data


    @staticmethod
    @log_gebruikers_activiteit
    async def mutate(_root, _info, id):
        """ Mutatie voor het verwijderen van een bestaand Alarm """
        result = await AlarmHelper.delete(_root, _info, id)

        return DeleteAlarm(ok=True, previous=result.previous, burger_id=result.burger_id)
