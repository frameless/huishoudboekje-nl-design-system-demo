import graphene

import hhb_backend.graphql.models.journaalpost as journaalpost
from hhb_backend.graphql.utils.gebruikersactiviteiten import log_gebruikers_activiteit
from hhb_backend.processen import automatisch_boeken



class StartAutomatischBoeken(graphene.Mutation):
    ok = graphene.Boolean()
    journaalposten = graphene.List(lambda: journaalpost.Journaalpost)

    def gebruikers_activiteit(self, _root, info, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=[]
        )

    @staticmethod
    @log_gebruikers_activiteit
    async def mutate(_root, _info, **kwargs):
        journaalposten = await automatisch_boeken.automatisch_boeken()

        return StartAutomatischBoeken(ok=True, journaalposten=journaalposten)
