""" GraphQL mutation for updating an existing Rekening """
import json

import graphene
import requests
from graphql import GraphQLError
from hhb_backend.graphql import settings

import hhb_backend.graphql.models.rekening as rekening
import hhb_backend.graphql.mutations.rekeningen.rekening_input as rekening_input
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
    log_gebruikers_activiteit,
)


class UpdateRekening(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        rekening = graphene.Argument(
            lambda: rekening_input.RekeningInput, required=True
        )

    ok = graphene.Boolean()
    rekening = graphene.Field(lambda: rekening.Rekening)
    previous = graphene.Field(lambda: rekening.Rekening)

    def gebruikers_activiteit(self, _root, info, *_args):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="rekening", result=self, key="rekening"
            )
            + gebruikers_activiteit_entities(
                entity_type="gebruiker", result=self, key="gebruikers"
            )
            + gebruikers_activiteit_entities(
                entity_type="organisatie", result=self, key="organisaties"
            ),
            before=dict(configuratie=self.previous),
            after=dict(configuratie=self.rekening),
        )

    @staticmethod
    @log_gebruikers_activiteit
    async def mutate(_root, _info, id, input):
        """ Create the new Rekening """
        previous = await hhb_dataloader().rekeningen_by_id.load(id)

        if previous is None:
            raise GraphQLError(f"Rekening does not exist")

        for k in ["iban", "rekeninghouder"]:
            input.setdefault(k, previous[k])

        if previous["iban"] != input["iban"]:
            raise GraphQLError(f"Rekening has different iban")

        response = requests.post(
            f"{settings.HHB_SERVICES_URL}/rekeningen/{id}", json=input
        )
        if response.status_code != 200:
            raise GraphQLError(f"Upstream API responded: {response.text}")

        rekening = response.json()["data"]

        return UpdateRekening(ok=True, rekening=rekening, previous=previous)
