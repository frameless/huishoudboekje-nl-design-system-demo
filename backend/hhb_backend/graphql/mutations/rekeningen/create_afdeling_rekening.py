""" GraphQL mutation for creating a new Rekening with an Organisation """

import graphene

import hhb_backend.graphql.models.rekening as graphene_rekening
import hhb_backend.graphql.mutations.rekeningen.rekening_input as rekening_input
from hhb_backend.audit_logging import AuditLogging
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
    rekening = graphene.Field(lambda: graphene_rekening.Rekening)

    @staticmethod
    def mutate(root, info, afdeling_id, rekening, **_kwargs):
        """ Create the new Rekening """
        result = create_afdeling_rekening(afdeling_id, rekening)

        AuditLogging.create(
            action=info.field_name,
            entities=[
                         dict(entity_type="afdeling", entity_id=afdeling_id) # Todo gebruikers_activiteit_entities? (07-11-2022)
                     ] + gebruikers_activiteit_entities(
                entity_type="rekening", result=rekening
            ),
            after=dict(rekening=rekening),
        )

        return CreateAfdelingRekening(rekening=result, ok=True)
