""" GraphQl Mutatie voor het verwijderen van een Signaal """
import graphene

from hhb_backend.graphql.models.signaal import Signaal
from hhb_backend.graphql.mutations.signalen.signalen import SignaalHelper
from hhb_backend.graphql.utils.gebruikersactiviteiten import log_gebruikers_activiteit, gebruikers_activiteit_entities


class DeleteSignaal(graphene.Mutation):
    class Arguments:
        id = graphene.String(required=True)

    ok = graphene.Boolean()
    previous = graphene.Field(lambda: Signaal)

    def gebruikers_activiteit(self, _root, _info, *_args, **_kwargs):
        data = dict(
            action=_info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="signaal", result=self, key="signaal"
            ),
            before=dict(signaal=self.previous),
        )
        i = _info.field_name.find("-")
        _info.field_name = _info.field_name[:i].strip()
        return data

    @staticmethod
    @log_gebruikers_activiteit
    async def mutate(_root, _info, id):
        """ Mutatie voor het verwijderen van een bestaand signaal """
        result = SignaalHelper.delete(id)

        return DeleteSignaal(ok=True, previous=result.previous)
