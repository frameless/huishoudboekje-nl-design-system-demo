""" GraphQL mutation for deleting a Rekening from an Organisatie """
import graphene
import requests
from graphql import GraphQLError

from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models import rekening
from hhb_backend.graphql.mutations.rekeningen.utils import (
    disconnect_afdeling_rekening,
    delete_rekening
)
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    log_gebruikers_activiteit,
)

class DeleteAfdelingRekening(graphene.Mutation):
    class Arguments:
        rekening_id = graphene.Int(required=True)
        afdeling_id = graphene.Int(required=True)

    ok = graphene.Boolean()
    previous = graphene.Field(lambda: rekening.Rekening)

    def gebruikers_activiteit(
        self, _root, info, rekening_id, afdeling_id, *_args, **_kwargs
    ):
        return dict(
            action=info.field_name,
            entities=[
                dict(entity_type="rekening", entity_id=rekening_id),
                dict(entity_type="afdeling", entity_id=afdeling_id),
            ],
            before=dict(rekening=self.previous),
        )

    @staticmethod
    @log_gebruikers_activiteit
    async def mutate(_root, _info, rekening_id, afdeling_id):
        """ Delete rekening associations with an afdeling """
        previous = await hhb_dataloader().rekeningen_by_id.load(rekening_id)

        # only delete rekening if it is not used by: burger, afdeling or sfspraak
        disconnect_afdeling_rekening(afdeling_id, rekening_id)
        delete_rekening(rekening_id)

        return DeleteAfdelingRekening(ok=True, previous=previous)
