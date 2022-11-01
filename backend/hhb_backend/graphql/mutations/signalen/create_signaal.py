""" GraphQL mutatie voor het aanmaken van een Signaal """
import graphene

from hhb_backend.graphql.models.signaal import Signaal
from hhb_backend.graphql.mutations.signalen.signalen import SignaalHelper, CreateSignaalInput
from hhb_backend.graphql.utils.gebruikersactiviteiten import log_gebruikers_activiteit, gebruikers_activiteit_entities

class CreateSignaal(graphene.Mutation):
    class Arguments:
        input = graphene.Argument(CreateSignaalInput, required=True)

    ok = graphene.Boolean()
    signaal = graphene.Field(lambda: Signaal)

    def gebruikers_activiteit(self, _root, _info, *_args, **_kwargs):
        data = dict(
            action=_info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="signaal", result=self, key="signaal"
            ),
            after=dict(signaal=self.signaal),
        )
        i = _info.field_name.find("-")
        _info.field_name = _info.field_name[:i].strip()
        return data

    @staticmethod
    @log_gebruikers_activiteit
    def mutate(root, info, input: CreateSignaalInput):
        """ Mutatie voor het aanmaken van een nieuw Signaal """
        response_signaal = SignaalHelper.create(input)

        return CreateSignaal(signaal=response_signaal.signaal, ok=True)
