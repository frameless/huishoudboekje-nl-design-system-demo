""" GraphQL mutatie voor het aanmaken van een Signaal """
import graphene

from hhb_backend.audit_logging import AuditLogging
import hhb_backend.graphql.models.signaal as graphene_signaal
from hhb_backend.graphql.mutations.signalen.signalen import SignaalHelper, CreateSignaalInput
from hhb_backend.graphql.utils.gebruikersactiviteiten import gebruikers_activiteit_entities, GebruikersActiviteitEntity


class CreateSignaal(graphene.Mutation):
    class Arguments:
        input = graphene.Argument(CreateSignaalInput, required=True)

    ok = graphene.Boolean()
    signaal = graphene.Field(lambda: graphene_signaal.Signaal)

    @staticmethod
    def mutate(self, info, input: CreateSignaalInput):
        """ Mutatie voor het aanmaken van een nieuw Signaal """
        response_signaal = SignaalHelper.create(input)
        signaal = response_signaal.signaal

        AuditLogging.create(
            action=info.field_name,
            entities=(
                GebruikersActiviteitEntity(entityType="signaal", entityId=signaal["id"]),
            ),
            after=dict(signaal=signaal),
        )

        return CreateSignaal(signaal=signaal, ok=True)
