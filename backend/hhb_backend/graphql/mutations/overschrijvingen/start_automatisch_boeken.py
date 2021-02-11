import graphene

import hhb_backend.graphql.models.journaalpost as journaalpost
from hhb_backend.processen import automatisch_boeken



class StartAutomatischBoeken(graphene.Mutation):

    ok = graphene.Boolean()
    journaalposten = graphene.List(lambda: journaalpost.Journaalpost)

    async def mutate(_root, _info, **kwargs):
        #TODO support for empty argument
        journaalposten = await automatisch_boeken.automatisch_boeken(0)

        return StartAutomatischBoeken(ok=True, journaalposten=journaalposten)

