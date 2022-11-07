import graphene

import hhb_backend.graphql.models.journaalpost as graphene_journaalpost
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.utils.gebruikersactiviteiten import log_gebruikers_activiteit
from hhb_backend.processen import automatisch_boeken


class StartAutomatischBoeken(graphene.Mutation):
    """Mutatie om niet afgeletterde banktransacties af te letteren."""

    ok = graphene.Boolean()
    journaalposten = graphene.List(lambda: graphene_journaalpost.Journaalpost)

    @staticmethod
    def mutate(_root, _info):
        journaalposten = automatisch_boeken.automatisch_boeken()

        AuditLogging.create(
            action=info.field_name,
            entities=[]
        )

        return StartAutomatischBoeken(ok=True, journaalposten=journaalposten)
