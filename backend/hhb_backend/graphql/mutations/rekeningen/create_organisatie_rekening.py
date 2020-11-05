""" GraphQL mutation for creating a new Rekening with an Organisation """

import graphene

import hhb_backend.graphql.models.rekening as rekening
import hhb_backend.graphql.mutations.rekeningen.rekening_input as rekening_input
from hhb_backend.graphql.mutations.rekeningen.utils import create_organisatie_rekening


class CreateOrganisatieRekening(graphene.Mutation):
    class Arguments:
        organisatie_id = graphene.Int(required=True)
        rekening = graphene.Argument(lambda: rekening_input.RekeningInput, required=True)

    ok = graphene.Boolean()
    rekening = graphene.Field(rekening.Rekening)

    @staticmethod
    def mutate(root, info, **kwargs):
        """ Create the new Rekening """
        organisatie_id = kwargs.pop('organisatie_id')
        rekening = kwargs.pop('rekening')

        result = create_organisatie_rekening(organisatie_id, rekening)
        return CreateOrganisatieRekening(rekening=result, ok=True)
