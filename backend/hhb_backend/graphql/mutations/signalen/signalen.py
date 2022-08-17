
import graphene
import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.utils.gebruikersactiviteiten import (log_gebruikers_activiteit, gebruikers_activiteit_entities)


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
    def __init__(self, signaal, previous, ok=True) -> None:
        self.signaal = signaal
        self.previous = previous
        self.ok = ok

    def gebruikers_activiteit(self, _root, info, *_args, **_kwargs):
        data = dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="signaal", result=self, key="signaal"
            ),
            before=dict(signaal=self.previous),
            after=dict(signaal=self.signaal),
        )
        i = info.field_name.find("-")
        info.field_name = info.field_name[:i].strip()
        return data

    @log_gebruikers_activiteit
    async def create(self, info, input: CreateSignaalInput):
        name = info.field_name
        if "Signaal" not in name:
            name += " - createSignaal"
            info.field_name = name

        create_signaal_response = requests.post(f"{settings.SIGNALENSERVICE_URL}/signals/", json=input, headers={"Content-type": "application/json"})
        if create_signaal_response.status_code != 201:
            raise GraphQLError(f"Aanmaken van het signaal is niet gelukt.")

        response_signaal = create_signaal_response.json()["data"]
        return SignaalHelper(response_signaal, dict())

    @log_gebruikers_activiteit
    async def delete(self, info, id):
        name = info.field_name
        if "Signaal" not in name:
            name += " - deleteSignaal"
            info.field_name = name

        previous = hhb_dataloader().signaal_by_id.load(id)
        if not previous:
            raise GraphQLError(f"Signaal with id {id} not found")

        response = requests.delete(f"{settings.SIGNALENSERVICE_URL}/signals/{id}")
        if response.status_code != 204:
            raise GraphQLError(f"Upstream API responded: {response.json()}")

        return SignaalHelper(dict(), previous)

    @log_gebruikers_activiteit
    async def update(self, info, id: str, input: UpdateSignaalInput):
        name = info.field_name
        if "Signaal" not in name:
            name += " - updateSignaal"
            info.field_name = name

        previous = hhb_dataloader().signaal_by_id.load(id)

        response = requests.put(f"{settings.SIGNALENSERVICE_URL}/signals/{id}", json=input, headers={"Content-type": "application/json"})
        if response.status_code != 200:
            raise GraphQLError(f"Upstream API responded: {response.json()}")
        response_signaal = response.json()['data']

        return SignaalHelper(response_signaal, previous)
