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
    rekening_used_check,
    delete_rekening,
    disconnect_burger_rekening
)
from hhb_backend.graphql.utils.gebruikersactiviteiten import (log_gebruikers_activiteit)


class DeleteBurgerRekening(graphene.Mutation):
    """Mutatie om een rekening bij een burger te verwijderen."""
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
        if not previous:
            raise GraphQLError("Rekening bestaat niet")

        # check uses, if used in afspraak - stop
        usedBy = rekening_used_check(id)
        afdeling_rekeningen = usedBy.get("afdelingen", [])
        burger_rekeningen = usedBy.get("burgers", [])
        afspraak_rekeningen = usedBy.get("afspraken", [])
        if len(afspraak_rekeningen) == 1:
            raise GraphQLError(f"Rekening wordt gebruikt in een afspraak - verwijderen is niet mogelijk.")
            
        # if used by burger, disconnect
        if len(burger_rekeningen) >= 1 and burger_id in burger_rekeningen:
            disconnect_burger_rekening(burger_id, id)
        elif burger_id not in burger_rekeningen:
            raise GraphQLError(f"Opgegeven burger beschikt niet over de opgegeven rekening.")

        # if not used - remove completely
        if len(burger_rekeningen) == 1 and len(afdeling_rekeningen) <= 0 and len(afspraak_rekeningen) <= 0:
            delete_rekening(id)

        return DeleteBurgerRekening(ok=True, previous=previous)
