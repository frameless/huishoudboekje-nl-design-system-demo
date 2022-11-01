import graphene

import hhb_backend.graphql.models.journaalpost as graphene_journaalpost
from hhb_backend.graphql.utils.gebruikersactiviteiten import log_gebruikers_activiteit
from hhb_backend.processen import automatisch_boeken



class StartAutomatischBoeken(graphene.Mutation):
    """Mutatie om niet afgeletterde banktransacties af te letteren."""
    
    ok = graphene.Boolean()
    journaalposten = graphene.List(lambda: graphene_journaalpost.Journaalpost)

    def gebruikers_activiteit(self, _root, info, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=[]
        )

    @staticmethod
    @log_gebruikers_activiteit
    def mutate(_root, _info, **kwargs):
        journaalposten = automatisch_boeken.automatisch_boeken()

        return StartAutomatischBoeken(ok=True, journaalposten=journaalposten)
