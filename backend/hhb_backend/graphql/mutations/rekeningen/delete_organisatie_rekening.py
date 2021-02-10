""" GraphQL mutation for deleting a Rekening from an Organisatie """
import json

import graphene
import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models import organisatie, rekening
from hhb_backend.graphql.mutations.rekeningen.utils import (
    cleanup_rekening_when_orphaned,
)
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
    log_gebruikers_activiteit,
)


class DeleteOrganisatieRekening(graphene.Mutation):
    class Arguments:
        rekening_id = graphene.Int(required=True)
        organisatie_id = graphene.Int(required=True)

    ok = graphene.Boolean()
    previous = graphene.Field(lambda: rekening.Rekening)
    organisatie = graphene.Field(lambda: organisatie.Organisatie)

    def gebruikers_activiteit(self, _root, info):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="rekening", result=self, key="previous"
            )
            + gebruikers_activiteit_entities(
                entity_type="organisatie", result=self, key="organisatie"
            ),
            after=dict(configuratie=self.rekening),
        )

    @staticmethod
    @log_gebruikers_activiteit
    async def mutate(_root, _info, rekening_id, organisatie_id):
        """ Delete rekening associations with an organisatie """
        previous = await hhb_dataloader().rekeningen_by_id.load(rekening_id)
        organisatie_id = await hhb_dataloader().organisaties_by_id.load(organisatie_id)

        delete_response = requests.delete(
            f"{settings.HHB_SERVICES_URL}/organisaties/{organisatie_id}/rekeningen/",
            json={"rekening_id": rekening_id},
        )
        if delete_response.status_code != 202:
            raise GraphQLError(f"Upstream API responded: {delete_response.json()}")

        cleanup_rekening_when_orphaned(rekening_id)

        return DeleteOrganisatieRekening(
            ok=True, previous=previous, organisatie=organisatie
        )
