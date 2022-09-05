""" GraphQL mutatie voor het aanmaken van een Signaal """
import graphene

from hhb_backend.graphql.models.signaal import Signaal
from hhb_backend.graphql.mutations.signalen.signalen import SignaalHelper, CreateSignaalInput


class CreateSignaal(graphene.Mutation):
    class Arguments:
        input = graphene.Argument(CreateSignaalInput, required=True)

    ok = graphene.Boolean()
    signaal = graphene.Field(lambda: Signaal)


    @staticmethod
    async def mutate(root, info, input: CreateSignaalInput):
        """ Mutatie voor het aanmaken van een nieuw Signaal """
        response_signaal = SignaalHelper.create(root, info, input)

        return CreateSignaal(signaal=response_signaal.signaal, ok=True)
