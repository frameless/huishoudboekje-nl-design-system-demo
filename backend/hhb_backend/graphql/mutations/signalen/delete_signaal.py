""" GraphQl Mutatie voor het verwijderen van een Signaal """
import graphene
from hhb_backend.graphql.models.signaal import Signal
from hhb_backend.graphql.utils.gebruikersactiviteiten import (gebruikers_activiteit_entities, log_gebruikers_activiteit)
import requests
from flask import request
from hhb_backend.graphql import settings
from graphql import GraphQLError

class DeleteSignaal(graphene.Mutation):
    class Arguments:
        id = graphene.String(required=True)

    ok = graphene.Boolean()
    previous = graphene.Field(lambda: Signal)

    def gebruikers_activiteit(self, _root, info, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="signaal", result=self, key="previous"
            ),
            before=dict(signaal=self.previous),
        )

    @staticmethod
    @log_gebruikers_activiteit
    async def mutate(_root, _info, id):
        """ Mutatie voor het verwijderen van een bestaand signaal """

        previous = await request.dataloader.signalen_by_id.load(id)
        if not previous:
            raise GraphQLError(f"Signaal with id {id} not found")

        response = requests.delete(f"{settings.SIGNALENSERVICE_URL}/signals/{id}")
        if response.status_code != 204:
            raise GraphQLError(f"Upstream API responded: {response.json()}")

        return DeleteSignaal(ok=True, previous=previous)
