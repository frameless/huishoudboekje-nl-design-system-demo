import graphene
import logging
import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.utils.gebruikersactiviteiten import (log_gebruikers_activiteit, gebruikers_activiteit_entities)
import hhb_backend.service.model.signaal as graphene_signaal


class CreateSignaalInput(graphene.InputObjectType):
    alarmId = graphene.String()
    banktransactieIds = graphene.List(graphene.Int)
    isActive = graphene.Boolean()
    type = graphene.String()
    actions = graphene.List(graphene.String)
    context = graphene.String()


class UpdateSignaalInput(graphene.InputObjectType):
    alarmId = graphene.String()
    banktransactieIds = graphene.List(graphene.Int)
    isActive = graphene.Boolean()
    type = graphene.String()
    actions = graphene.List(graphene.String)
    context = graphene.String()


class SignaalHelper:
    def __init__(self, signaal, previous, ok=True) -> None:
        self.signaal = graphene_signaal.Signaal(signaal)
        self.previous = previous
        self.ok = ok

    @staticmethod
    def create(input: CreateSignaalInput):
        logging.info(f"SignaalHelper.create: creating signaal... Input: {input}")

        create_signaal_response = requests.post(f"{settings.SIGNALENSERVICE_URL}/signals/", json=input,
                                                headers={"Content-type": "application/json"})
        if create_signaal_response.status_code != 201:
            raise GraphQLError(f"Failed to create signaal.")

        response_signaal = create_signaal_response.json()["data"]

        logging.info(f"SignaalHelper.create: created signaal. Response: {response_signaal}")
        return SignaalHelper(response_signaal, dict())

    @staticmethod
    def delete(id):
        logging.info(f"SignaalHelper.delete: deleting signaal... Id: {id}")

        previous = hhb_dataloader().signalen.load_one(id)
        if not previous:
            raise GraphQLError(f"Signaal with id {id} not found")

        response = requests.delete(f"{settings.SIGNALENSERVICE_URL}/signals/{id}")
        if response.status_code != 204:
            raise GraphQLError(f"Upstream API responded: {response.json()}")

        logging.info(f"SignaalHelper.delete: deleted signaal. Id: {id}")
        return SignaalHelper(dict(), previous)

    @staticmethod
    def update(id: str, input: UpdateSignaalInput):
        logging.info(f"SignaalHelper.update: updating signaal... id {id}, input: {input}")
        previous = hhb_dataloader().signalen.load_one(id)

        response = requests.put(f"{settings.SIGNALENSERVICE_URL}/signals/{id}", json=input,
                                headers={"Content-type": "application/json"})
        if response.status_code != 200:
            raise GraphQLError(f"Upstream API responded: {response.json()}")
        response_signaal = response.json()['data']

        logging.info(f"SignaalHelper.update: updated signaal. Id {id}, input: {input}.")
        return SignaalHelper(response_signaal, previous)
