""" GraphQL mutation for deleting a Rekening from a Burger """
import json

import graphene
import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models import burger, rekening
from hhb_backend.graphql.mutations.rekeningen.utils import (
    cleanup_rekening_when_orphaned,
)
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
    log_gebruikers_activiteit,
)


class DeleteBurgerRekening(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        burger_id = graphene.Int(required=True)

    ok = graphene.Boolean()
    previous = graphene.Field(lambda: rekening.Rekening)

    def gebruikers_activiteit(self, _root, info, id, burger_id, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=[
                dict(entity_type="rekening", entity_id=id),
                dict(entity_type="burger", entity_id=burger_id),
            ],
            before=dict(rekening=self.previous),
        )

    @staticmethod
    @log_gebruikers_activiteit
    async def mutate(_root, _info, id, burger_id):
        """ Delete rekening associations with either burger or organisation """
        previous = await hhb_dataloader().rekeningen_by_id.load(id)

        delete_response = requests.delete(
            f"{settings.HHB_SERVICES_URL}/burgers/{burger_id}/rekeningen/",
            json={"rekening_id": id},
        )
        if delete_response.status_code != 202:
            raise GraphQLError(f"Upstream API responded: {delete_response.text}")

        cleanup_rekening_when_orphaned(id)

        return DeleteBurgerRekening(ok=True, previous=previous)
