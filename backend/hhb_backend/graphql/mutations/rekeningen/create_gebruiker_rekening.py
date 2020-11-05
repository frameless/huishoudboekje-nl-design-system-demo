""" GraphQL mutation for creating a new Rekening with a Gebruiker """

import graphene

import hhb_backend.graphql.models.rekening as rekening
import hhb_backend.graphql.mutations.rekeningen.rekening_input as rekening_input
from hhb_backend.graphql.mutations.rekeningen.utils import create_gebruiker_rekening


class CreateGebruikerRekening(graphene.Mutation):
    class Arguments:
        gebruiker_id = graphene.Int(required=True)
        rekening = graphene.Argument(lambda: rekening_input.RekeningInput, required=True)

    ok = graphene.Boolean()
    rekening = graphene.Field(rekening.Rekening)

    @staticmethod
    def mutate(root, info, **kwargs):
        """ Create the new Rekening """
        gebruiker_id = kwargs.pop('gebruiker_id')
        rekening = kwargs.pop('rekening')

        result = create_gebruiker_rekening(gebruiker_id, rekening)
        return CreateGebruikerRekening(rekening=result, ok=True)


