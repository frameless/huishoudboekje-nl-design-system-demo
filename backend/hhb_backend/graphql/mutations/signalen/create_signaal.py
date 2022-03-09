""" GraphQL mutatie voor het aanmaken van een Signaal """
from hhb_backend.graphql.models import signaal
import graphene
from hhb_backend.graphql.models.signaal import Signaal
from hhb_backend.graphql.utils.gebruikersactiviteiten import (log_gebruikers_activiteit, gebruikers_activiteit_entities)
import requests
from graphql import GraphQLError
from hhb_backend.graphql import settings

class CreateSignaalInput(graphene.InputObjectType):
    alarmId = graphene.String()
    banktransactieIds = graphene.List(graphene.Int) 
    isActive = graphene.Boolean()
    type = graphene.String()
    actions = graphene.List(graphene.String, default_value=[])
    context = graphene.String()

class CreateSignaal(graphene.Mutation):
    class Arguments:
        input = graphene.Argument(CreateSignaalInput, required=True)

    ok = graphene.Boolean()
    signaal = graphene.Field(lambda: Signaal)

    def gebruikers_activiteit(self, _root, info, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="signaal", result=self, key="signaal"
            ),
            after=dict(signaal=self.signaal),
        )

    @staticmethod
    @log_gebruikers_activiteit
    async def mutate(_root, _info, input: CreateSignaalInput):
        """ Mutatie voor het aanmaken van een nieuw Signaal """

        create_signaal_response = requests.post(f"{settings.SIGNALENSERVICE_URL}/signals/", json=input, headers={"Content-type": "application/json"})
        if create_signaal_response.status_code != 201:
            raise GraphQLError(f"Aanmaken van het signaal is niet gelukt.")

        response_signaal = create_signaal_response.json()["data"]

        return CreateSignaal(signaal=response_signaal, ok=True)