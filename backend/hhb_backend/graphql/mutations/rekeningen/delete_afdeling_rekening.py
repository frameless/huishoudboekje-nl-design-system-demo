""" GraphQL mutation for deleting a Rekening from an Organisatie """
import logging
import graphene

from graphql import GraphQLError
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models import rekening
from hhb_backend.graphql.mutations.rekeningen.utils import disconnect_afdeling_rekening, delete_rekening, \
    rekening_used_check
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity


class DeleteAfdelingRekening(graphene.Mutation):
    """Mutatie om een rekening van een afdeling te verwijderen."""

    class Arguments:
        rekening_id = graphene.Int(required=True)
        afdeling_id = graphene.Int(required=True)

    ok = graphene.Boolean()
    previous = graphene.Field(lambda: rekening.Rekening)

    @staticmethod
    def mutate(self, info, rekening_id, afdeling_id):
        """ Delete rekening associations with an afdeling """
        logging.info(f"Deleting rekening {rekening_id}")
        previous = hhb_dataloader().rekeningen.load_one(rekening_id)
        if not previous:
            raise GraphQLError("Rekening not found")

        # check uses, if used in afspraak - stop
        afdelingen, afspraken, burgers = rekening_used_check(rekening_id)
        if afdelingen and len(afdelingen) > 1:
            afdeling_afspraken = hhb_dataloader().afspraken.by_afdeling(afdeling_id)
            if len(afdeling_afspraken) == 0:
                disconnect_afdeling_rekening(afdeling_id, rekening_id)
            else:
                raise GraphQLError(f"Rekening and with afdeling are used in an afspraak - deletion is not possible.")
        else:     
            if afspraken:
                raise GraphQLError(f"Rekening and with afdeling are used in an afspraak - deletion is not possible.")

            # if used by afdeling, disconnect
            if afdelingen and afdeling_id in afdelingen:
                disconnect_afdeling_rekening(afdeling_id, rekening_id)
            elif afdeling_id not in afdelingen:
                raise GraphQLError(f"Specified afdeling does not have the specified rekening.")

            # if not used - remove completely
            if len(afdelingen) == 1 and not burgers and not afspraken:
                delete_rekening(rekening_id)

        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="rekening", entityId=rekening_id),
                GebruikersActiviteitEntity(entityType="afdeling", entityId=afdeling_id),
            ],
            before=dict(rekening=previous),
        )

        return DeleteAfdelingRekening(ok=True, previous=previous)
