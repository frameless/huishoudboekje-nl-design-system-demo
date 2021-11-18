""" GraphQL mutation for creating a new Rekening with an Organisation """

import graphene

import hhb_backend.graphql.models.rekening as rekening
import hhb_backend.graphql.mutations.rekeningen.rekening_input as rekening_input
from hhb_backend.graphql.mutations.rekeningen.utils import create_afdeling_rekening
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
    log_gebruikers_activiteit,
)


class CreateAfdelingRekening(graphene.Mutation):
    """Mutatie om een rekening aan een afdeling toe te voegen."""
    class Arguments:
        afdeling_id = graphene.Int(required=True)
        rekening = graphene.Argument(
            lambda: rekening_input.RekeningInput, required=True
        )

    ok = graphene.Boolean()
    rekening = graphene.Field(rekening.Rekening)

    def gebruikers_activiteit(self, _root, info, afdeling_id, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=[dict(entity_type="afdeling", entity_id=afdeling_id)]
            + gebruikers_activiteit_entities(
                entity_type="rekening", result=self, key="rekening"
            ),
            after=dict(rekening=self.rekening),
        )

    @staticmethod
    @log_gebruikers_activiteit
    async def mutate(_root, _info, afdeling_id, rekening, **_kwargs):
        """ Create the new Rekening """
        result = create_afdeling_rekening(afdeling_id, rekening)
        return CreateAfdelingRekening(rekening=result, ok=True)
