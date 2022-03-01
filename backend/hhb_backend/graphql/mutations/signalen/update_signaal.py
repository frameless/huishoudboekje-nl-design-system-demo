""" GraphQl Mutatie voor het aanpassen van een Alarm """
import graphene
from hhb_backend.graphql.models.signaal import Signaal
from hhb_backend.graphql.utils.gebruikersactiviteiten import (gebruikers_activiteit_entities, log_gebruikers_activiteit)
import requests
from hhb_backend.graphql import settings
from graphql import GraphQLError

class UpdateSignaalInput(graphene.InputObjectType):
    alarmId = graphene.String()
    isActive = graphene.Boolean()
    type = graphene.String()
    actions = graphene.List(graphene.String, default_value=[])
    context = graphene.String()

class UpdateSignaal(graphene.Mutation):
    class Arguments:
        id = graphene.String(required=True)
        input = graphene.Argument(UpdateSignaalInput, required=True)

    ok = graphene.Boolean()
    signaal = graphene.Field(lambda: Signaal)
    previous = graphene.Field(lambda: Signaal)

    def gebruikers_activiteit(self, _root, info, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="signaal", result=self, key="signaal"
            ),
            before=dict(signaal=self.previous),
            after=dict(signaal=self.signaal),
        )

    @staticmethod
    @log_gebruikers_activiteit
    async def mutate(_root, _info, id: str, input: UpdateSignaalInput):
        """ Mutatie voor het wijzigen van een bestaand Signaal """

        previous_response = requests.get(f"{settings.SIGNALENSERVICE_URL}/signals/{id}", headers={"Content-type": "application/json"})
        if previous_response.status_code != 200:
            raise GraphQLError(f"Signaal bestaat niet.")
        previous = previous_response.json()

        response = requests.put(f"{settings.SIGNALENSERVICE_URL}/signals/{id}", json=input, headers={"Content-type": "application/json"})
        if response.status_code != 200:
            raise GraphQLError(f"Upstream API responded: {response.json()}")
        response_signaal = response.json()['data']

        return UpdateSignaal(signaal=response_signaal, previous=previous, ok=True)