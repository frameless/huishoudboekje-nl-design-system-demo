""" GraphQl Mutatie voor het aanpassen van een Alarm """
import graphene

from hhb_backend.graphql.models.signaal import Signaal
from hhb_backend.graphql.mutations.signalen.signalen import SignaalHelper, UpdateSignaalInput
from hhb_backend.graphql.utils.gebruikersactiviteiten import log_gebruikers_activiteit, gebruikers_activiteit_entities

class UpdateSignaal(graphene.Mutation):
    class Arguments:
        id = graphene.String(required=True)
        input = graphene.Argument(UpdateSignaalInput, required=True)

    ok = graphene.Boolean()
    signaal = graphene.Field(lambda: Signaal)
    previous = graphene.Field(lambda: Signaal)

    def gebruikers_activiteit(self, _root, _info, *_args, **_kwargs):
        data = dict(
            action=_info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="signaal", result=self, key="signaal"
            ),
            before=dict(signaal=self.previous),
            after=dict(signaal=self.signaal),
        )
        i = _info.field_name.find("-")
        _info.field_name = _info.field_name[:i].strip()
        return data

    @staticmethod
    @log_gebruikers_activiteit
    def mutate(root, info, id: str, input: UpdateSignaalInput):
        """ Mutatie voor het wijzigen van een bestaand Signaal """
        response = SignaalHelper.update(id, input)

        return UpdateSignaal(signaal=response.signaal, previous=response.previous, ok=True)
