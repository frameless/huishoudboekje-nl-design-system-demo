""" GraphQL mutation for creating a new Organisatie """
import graphene

from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.datawriters import hhb_datawriter
from hhb_backend.graphql.models.organisatie import Organisatie
from hhb_backend.graphql.utils.gebruikersactiviteiten import gebruikers_activiteit_entities


class CreateOrganisatieInput(graphene.InputObjectType):
    # org_service elements (required)
    naam = graphene.String()
    kvknummer = graphene.String(required=True)
    vestigingsnummer = graphene.String()


class CreateOrganisatie(graphene.Mutation):
    class Arguments:
        input = graphene.Argument(CreateOrganisatieInput)

    ok = graphene.Boolean()
    organisatie = graphene.Field(lambda: Organisatie)

    @staticmethod
    def mutate(self, info, input: CreateOrganisatieInput):
        """ Create the new Organisatie """

        Organisatie.unique_kvk_vestigingsnummer(input.kvknummer, input.get("vestigingsnummer"))
        result = hhb_datawriter().organisaties.post(input)

        AuditLogging.create(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="organisatie", result=result
            ),
            after=dict(organisatie=result),
        )

        return CreateOrganisatie(organisatie=result, ok=True)
