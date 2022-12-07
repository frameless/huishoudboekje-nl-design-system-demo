""" GraphQl Mutatie voor het verwijderen van een Signaal """
import graphene

import hhb_backend.graphql.models.signaal as graphene_signaal
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.mutations.signalen.signalen import SignaalHelper
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity


class DeleteSignaal(graphene.Mutation):
    class Arguments:
        id = graphene.String(required=True)

    ok = graphene.Boolean()
    previous = graphene.Field(lambda: graphene_signaal.Signaal)

    @staticmethod
    def mutate(self, info, id):
        """ Mutatie voor het verwijderen van een bestaand signaal """
        result = SignaalHelper.delete(id)
        previous = result.previous

        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="signaal", entityId=id),
            ],
            before=dict(signaal=previous),
        )

        return DeleteSignaal(ok=True, previous=previous)
