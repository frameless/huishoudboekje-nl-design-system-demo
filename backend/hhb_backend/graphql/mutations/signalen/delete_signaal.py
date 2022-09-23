""" GraphQl Mutatie voor het verwijderen van een Signaal """
import graphene

from hhb_backend.graphql.models.signaal import Signaal
from hhb_backend.graphql.mutations.signalen.signalen import SignaalHelper


class DeleteSignaal(graphene.Mutation):
    class Arguments:
        id = graphene.String(required=True)

    ok = graphene.Boolean()
    previous = graphene.Field(lambda: Signaal)

    @staticmethod
    async def mutate(_root, _info, id):
        """ Mutatie voor het verwijderen van een bestaand signaal """
        result = await SignaalHelper.delete(_root, _info, id)

        return DeleteSignaal(ok=True, previous=result.previous)
