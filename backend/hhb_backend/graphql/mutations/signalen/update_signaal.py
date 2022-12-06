""" GraphQl Mutatie voor het aanpassen van een Alarm """
import graphene

import hhb_backend.graphql.models.signaal as graphene_signaal
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.mutations.signalen.signalen import SignaalHelper, UpdateSignaalInput
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity


class UpdateSignaal(graphene.Mutation):
    class Arguments:
        id = graphene.String(required=True)
        input = graphene.Argument(UpdateSignaalInput, required=True)

    ok = graphene.Boolean()
    signaal = graphene.Field(lambda: graphene_signaal.Signaal)
    previous = graphene.Field(lambda: graphene_signaal.Signaal)

    @staticmethod
    def mutate(self, info, id: str, input: UpdateSignaalInput):
        """ Mutatie voor het wijzigen van een bestaand Signaal """
        response = SignaalHelper.update(id, input)
        signaal = response.signaal
        previous = response.previous

        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="signaal", entityId=signaal["id"]),
            ],
            before=dict(signaal=previous),
            after=dict(signaal=signaal),
        )

        return UpdateSignaal(signaal=signaal, previous=previous, ok=True)
