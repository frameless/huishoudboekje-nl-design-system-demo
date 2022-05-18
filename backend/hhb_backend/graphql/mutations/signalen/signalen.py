
import graphene
import requests
from graphql import GraphQLError
from flask import request

from hhb_backend.graphql.utils.gebruikersactiviteiten import (log_gebruikers_activiteit, gebruikers_activiteit_entities)
from hhb_backend.graphql import settings

class CreateSignaalInput(graphene.InputObjectType):
    alarmId = graphene.String()
    banktransactieIds = graphene.List(graphene.Int) 
    isActive = graphene.Boolean()
    type = graphene.String()
    actions = graphene.List(graphene.String, default_value=[])
    context = graphene.String()

class UpdateSignaalInput(graphene.InputObjectType):
    alarmId = graphene.String()
    banktransactieIds = graphene.List(graphene.Int)
    isActive = graphene.Boolean()
    type = graphene.String()
    actions = graphene.List(graphene.String, default_value=[])
    context = graphene.String()


class SignaalHelper:
    def __init__(self, signaal, previous, ok) -> None:
        self.signaal = signaal
        self.previous = previous
        self.ok = ok

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

    @log_gebruikers_activiteit
    async def create(_root, _info, input: CreateSignaalInput):
        name = _info.field_name
        if "Signaal" not in name:
                name += " - createSignaal"
                _info.field_name = name
        create_signaal_response = requests.post(f"{settings.SIGNALENSERVICE_URL}/signals/", json=input, headers={"Content-type": "application/json"})
        if create_signaal_response.status_code != 201:
            raise GraphQLError(f"Aanmaken van het signaal is niet gelukt.")

        response_signaal = create_signaal_response.json()["data"]
        return SignaalHelper(signaal=response_signaal, previous=dict(), ok=True)

    @log_gebruikers_activiteit
    async def delete(_root, _info, id):
        name = _info.field_name
        if "Signaal" not in name:
                name += " - deleteSignaal"
                _info.field_name = name
        previous = await request.dataloader.signalen_by_id.load(id)
        if not previous:
            raise GraphQLError(f"Signaal with id {id} not found")

        response = requests.delete(f"{settings.SIGNALENSERVICE_URL}/signals/{id}")
        if response.status_code != 204:
            raise GraphQLError(f"Upstream API responded: {response.json()}")

        return SignaalHelper(signaal=dict(), previous=previous, ok=True)

    @log_gebruikers_activiteit
    async def update(_root, _info, id: str, input: UpdateSignaalInput):
        name = _info.field_name
        if "Signaal" not in name:
                name += " - updateSignaal"
                _info.field_name = name

        previous_response = requests.get(f"{settings.SIGNALENSERVICE_URL}/signals/{id}", headers={"Content-type": "application/json"})
        if previous_response.status_code != 200:
            raise GraphQLError(f"Signaal bestaat niet.")
        previous = previous_response.json()

        response = requests.put(f"{settings.SIGNALENSERVICE_URL}/signals/{id}", json=input, headers={"Content-type": "application/json"})
        if response.status_code != 200:
            raise GraphQLError(f"Upstream API responded: {response.json()}")
        response_signaal = response.json()['data']

        return SignaalHelper(signaal=response_signaal, previous=previous, ok=True)