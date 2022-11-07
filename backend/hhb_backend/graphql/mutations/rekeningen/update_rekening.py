""" GraphQL mutation for updating an existing Rekening """

import graphene
import requests
from graphql import GraphQLError

import hhb_backend.graphql.models.rekening as rekening
import hhb_backend.graphql.mutations.rekeningen.rekening_input as rekening_input
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql import settings
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

    @staticmethod
    def mutate(root, info, id, rekening):
        """ Create the new Rekening """
        previous = hhb_dataloader().rekeningen.load_one(id)

        if previous is None:
            raise GraphQLError(f"Rekening not found")

        for k in ["iban", "rekeninghouder"]:
            rekening.setdefault(k, previous[k])

        if previous.iban != rekening["iban"]:
            raise GraphQLError(f"Rekening has different iban")

        response = requests.post(
            f"{settings.HHB_SERVICES_URL}/rekeningen/{id}", json=rekening
        )
        if response.status_code != 200:
            raise GraphQLError(f"Upstream API responded: {response.text}")

        result = response.json()["data"]

        AuditLogging.create(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="rekening", result=rekening
            )
                     + gebruikers_activiteit_entities(
                entity_type="burger", result=burgers
            )
                     + gebruikers_activiteit_entities(
                entity_type="organisatie", result=organisaties
            ),
            before=dict(rekening=previous),
            after=dict(rekening=rekening),
        )

        return UpdateRekening(ok=True, rekening=result, previous=previous)
