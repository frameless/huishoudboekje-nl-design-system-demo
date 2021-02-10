""" GraphQL mutation for creating a new Rekening with a Gebruiker """

import graphene

import hhb_backend.graphql.models.rekening as rekening
import hhb_backend.graphql.mutations.rekeningen.rekening_input as rekening_input
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models import gebruiker
from hhb_backend.graphql.mutations.rekeningen.utils import create_gebruiker_rekening
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
    log_gebruikers_activiteit,
)


class CreateGebruikerRekening(graphene.Mutation):
    class Arguments:
        gebruiker_id = graphene.Int(required=True)
        rekening = graphene.Argument(
            lambda: rekening_input.RekeningInput, required=True
        )

    ok = graphene.Boolean()
    rekening = graphene.Field(lambda: rekening.Rekening)
    gebruiker = graphene.Field(lambda: gebruiker.Gebruiker)

    def gebruikers_activiteit(self, _root, info):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="rekening", result=self, key="rekening"
            )
            + gebruikers_activiteit_entities(
                entity_type="gebruiker", result=self, key="gebruiker"
            ),
            after=dict(configuratie=self.rekening),
        )

    @staticmethod
    @log_gebruikers_activiteit
    async def mutate(_root, _info, **kwargs):
        """ Create the new Rekening """
        gebruiker_id = kwargs.pop("gebruiker_id")
        input = kwargs.pop("rekening")

        gebruiker = await hhb_dataloader().gebruikers_by_id.load(gebruiker_id)
        rekening = create_gebruiker_rekening(gebruiker_id, input)
        return CreateGebruikerRekening(rekening=rekening, ok=True, gebruiker=gebruiker)
