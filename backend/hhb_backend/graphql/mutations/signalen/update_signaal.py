""" GraphQl Mutatie voor het aanpassen van een Alarm """
import graphene
from hhb_backend.graphql.models.signaal import Signaal
from hhb_backend.graphql.mutations.signalen.signalen import SignaalHelper, UpdateSignaalInput


class UpdateSignaal(graphene.Mutation):
    class Arguments:
        id = graphene.String(required=True)
        input = graphene.Argument(UpdateSignaalInput, required=True)

    ok = graphene.Boolean()
    signaal = graphene.Field(lambda: Signaal)
    previous = graphene.Field(lambda: Signaal)

    @staticmethod
    async def mutate(_root, _info, id: str, input: UpdateSignaalInput):
        """ Mutatie voor het wijzigen van een bestaand Signaal """
        response = await SignaalHelper.update(_root, _info, id, input)

        return UpdateSignaal(signaal=response.signaal, previous=response.previous, ok=True)