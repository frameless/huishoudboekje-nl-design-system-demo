""" GraphQl Mutatie voor het verwijderen van een Signaal """
import graphene

from hhb_backend.audit_logging import AuditLogging
import hhb_backend.graphql.models.signaal as graphene_signaal
from hhb_backend.graphql.mutations.signalen.signalen import SignaalHelper
from hhb_backend.graphql.utils.gebruikersactiviteiten import log_gebruikers_activiteit, gebruikers_activiteit_entities


class DeleteSignaal(graphene.Mutation):
    class Arguments:
        id = graphene.String(required=True)

    ok = graphene.Boolean()
    previous = graphene.Field(lambda: graphene_signaal.Signaal)

    @staticmethod
    def mutate(root, info, id):
        """ Mutatie voor het verwijderen van een bestaand signaal """
        result = SignaalHelper.delete(id)

        AuditLogging.create(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="signaal", result=signaal
            ),
            before=dict(signaal=previous),
        )

        return DeleteSignaal(ok=True, previous=previous)
