""" GraphQL mutation for deleting a Rekening from an Organisatie """
import graphene
from graphql import GraphQLError

from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models import rekening
from hhb_backend.graphql.mutations.rekeningen.utils import disconnect_afdeling_rekening, delete_rekening, \
    rekening_used_check
from hhb_backend.graphql.utils.gebruikersactiviteiten import log_gebruikers_activiteit


class DeleteAfdelingRekening(graphene.Mutation):
    """Mutatie om een rekening van een afdeling te verwijderen."""

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
        previous = hhb_dataloader().rekeningen.load_one(rekening_id)
        if not previous:
            raise GraphQLError("Rekening not found")

        # check uses, if used in afspraak - stop
        afdelingen, afspraken, burgers = rekening_used_check(rekening_id)
        if afspraken:
            raise GraphQLError(f"Rekening is used in an afspraak - deletion is not possible.")

        # if used by afdeling, disconnect
        if afdelingen and afdeling_id in afdelingen:
            disconnect_afdeling_rekening(afdeling_id, rekening_id)
        elif afdeling_id not in afdelingen:
            raise GraphQLError(f"Specified afdeling does not have the specified rekening.")

        # if not used - remove completely
        if len(afdelingen) == 1 and not burgers and not afspraken:
            delete_rekening(rekening_id)

        return DeleteAfdelingRekening(ok=True, previous=previous)
