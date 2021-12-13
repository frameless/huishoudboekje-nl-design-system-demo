""" GraphQl Mutatie voor het verwijderen van een Alarm """
import graphene
from hhb_backend.graphql.models.Alarm import Alarm
from hhb_backend.graphql.utils.gebruikersactiviteiten import (gebruikers_activiteit_entities, log_gebruikers_activiteit)
import requests
from flask import request
from hhb_backend.graphql import settings
from graphql import GraphQLError

class DeleteAlarm(graphene.Mutation):
    class Arguments:
        id = graphene.String(required=True)

    ok = graphene.Boolean()
    previous = graphene.Field(lambda: Alarm)

    def gebruikers_activiteit(self, _root, info, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="alarm", result=self, key="previous"
            ),
            before=dict(alarm=self.previous),
        )

    @staticmethod
    @log_gebruikers_activiteit
    async def mutate(_root, _info, id):
        """ Mutatie voor het verwijderen van een bestaand Alarm """

        previous = await request.dataloader.alarmen_by_id.load(id)
        if not previous:
            raise GraphQLError(f"Alarm with id {id} not found")

        response = requests.delete(f"{settings.ALARMENSERVICE_URL}/alarms/{id}")
        if response.status_code != 204:
            raise GraphQLError(f"Upstream API responded: {response.json()}")

        return DeleteAlarm(ok=True, previous=previous)
