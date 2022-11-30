""" GraphQL mutation for deleting a Rekening from a Burger """

import graphene
from graphql import GraphQLError

from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models import rekening
from hhb_backend.graphql.mutations.rekeningen.utils import (
    rekening_used_check,
    delete_rekening,
    disconnect_burger_rekening
)
from hhb_backend.graphql.utils.gebruikersactiviteiten import log_gebruikers_activiteit


class DeleteBurgerRekening(graphene.Mutation):
    """Mutatie om een rekening bij een burger te verwijderen."""

    class Arguments:
        id = graphene.Int(required=True)
        burger_id = graphene.Int(required=True)

    ok = graphene.Boolean()
    previous = graphene.Field(lambda: rekening.Rekening)

    @staticmethod
    def mutate(self, info, id, burger_id):
        """ Delete rekening associations with either burger or organisation """
        previous = hhb_dataloader().rekeningen.load_one(id)
        if not previous:
            raise GraphQLError("Rekening not found")

        # check uses, if used in afspraak - stop
        afdelingen, afspraken, burgers = rekening_used_check(id)
        if afspraken:
            raise GraphQLError(f"Rekening is used in an afspraak - deletion is not possible.")

        # if used by burger, disconnect
        if burgers and burger_id in burgers:
            disconnect_burger_rekening(burger_id, id)
        elif burger_id not in burgers:
            raise GraphQLError(f"Specified burger does not have the specified rekening.")

        # if not used - remove completely
        if len(burgers) == 1 and not afdelingen and not afspraken:
            delete_rekening(id)

        AuditLogging.create(
            action=info.field_name,
            entities=[
                dict(entity_type="rekening", entity_id=id),  # Todo gebruikers_activiteit_entities? (07-11-2022)
                dict(entity_type="burger", entity_id=burger_id),  # Todo gebruikers_activiteit_entities? (07-11-2022)
            ],
            before=dict(rekening=previous),
        )

        return DeleteBurgerRekening(ok=True, previous=previous)
