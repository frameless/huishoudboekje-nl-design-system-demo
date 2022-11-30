""" GraphQL mutation for creating a new Rekening with a Burger """

import graphene

import hhb_backend.graphql.models.rekening as rekening
import hhb_backend.graphql.mutations.rekeningen.rekening_input as rekening_input
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.mutations.rekeningen.utils import create_burger_rekening
from hhb_backend.graphql.utils.gebruikersactiviteiten import gebruikers_activiteit_entities


class CreateBurgerRekening(graphene.Mutation):
    """Mutatie om een rekening aan een burger toe te voegen."""

    class Arguments:
        burger_id = graphene.Int(required=True)
        rekening = graphene.Argument(
            lambda: rekening_input.RekeningInput, required=True
        )

    ok = graphene.Boolean()
    rekening = graphene.Field(lambda: rekening.Rekening)

    @staticmethod
    def mutate(self, info, burger_id, rekening):
        """ Create the new Rekening """
        result = create_burger_rekening(burger_id, rekening)

        AuditLogging.create(
            action=info.field_name,
            entities=[dict(entity_type="burger", entity_id=burger_id)] + gebruikers_activiteit_entities(
                entity_type="rekening", result=result
            ),
            after=dict(rekening=result),
        )

        return CreateBurgerRekening(rekening=result, ok=True)
