""" GraphQL mutation for deleting a Rekening from a Gebruiker """
import json

import graphene
import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models import gebruiker, rekening
from hhb_backend.graphql.mutations.rekeningen.utils import (
    cleanup_rekening_when_orphaned,
)
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
    log_gebruikers_activiteit,
)


class DeleteGebruikerRekening(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        gebruiker_id = graphene.Int(required=True)

    ok = graphene.Boolean()
    previous = graphene.Field(lambda: rekening.Rekening)
    gebruiker = graphene.Field(lambda: gebruiker.Gebruiker)

    def gebruikers_activiteit(self, _root, info):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="rekening", result=self, key="previous"
            )
            + gebruikers_activiteit_entities(
                entity_type="gebruiker", result=self, key="gebruiker"
            ),
            after=dict(configuratie=self.rekening),
        )

    @staticmethod
    @log_gebruikers_activiteit
    async def mutate(_root, _info, id, gebruiker_id):
        """ Delete rekening associations with either gebruiker or organisation """
        previous = await hhb_dataloader().rekeningen_by_id.load(id)
        gebruiker = await hhb_dataloader().gebruikers_by_id.load(gebruiker_id)

        delete_response = requests.delete(
            f"{settings.HHB_SERVICES_URL}/gebruikers/{gebruiker_id}/rekeningen/",
            json={"rekening_id": id},
        )
        if delete_response.status_code != 202:
            raise GraphQLError(f"Upstream API responded: {delete_response.text}")

        cleanup_rekening_when_orphaned(id)

        return DeleteGebruikerRekening(ok=True, previous=previous, gebruiker=gebruiker)
