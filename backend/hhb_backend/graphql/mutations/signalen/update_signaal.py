""" GraphQl Mutatie voor het aanpassen van een Alarm """
import graphene

from hhb_backend.audit_logging import AuditLogging
import hhb_backend.graphql.models.signaal as graphene_signaal
from hhb_backend.graphql.mutations.signalen.signalen import SignaalHelper, UpdateSignaalInput
from hhb_backend.graphql.utils.gebruikersactiviteiten import log_gebruikers_activiteit, gebruikers_activiteit_entities


class UpdateSignaal(graphene.Mutation):
    class Arguments:
        id = graphene.String(required=True)
        input = graphene.Argument(UpdateSignaalInput, required=True)

    ok = graphene.Boolean()
    signaal = graphene.Field(lambda: graphene_signaal.Signaal)
    previous = graphene.Field(lambda: graphene_signaal.Signaal)

    @staticmethod
    def mutate(root, info, id: str, input: UpdateSignaalInput):
        """ Mutatie voor het wijzigen van een bestaand Signaal """
        response = SignaalHelper.update(id, input)

        AuditLogging.create(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="signaal", result=signaal
            ),
            before=dict(signaal=previous),
            after=dict(signaal=signaal),
        )

        return UpdateSignaal(signaal=response.signaal, previous=response.previous, ok=True)
