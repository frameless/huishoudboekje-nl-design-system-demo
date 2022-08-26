""" GraphQL mutation for creating a new Organisatie """
import graphene

from hhb_backend.graphql.datawriters import hhb_datawriter
from hhb_backend.graphql.models.organisatie import Organisatie
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
    log_gebruikers_activiteit,
)


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

    def gebruikers_activiteit(self, _root, info, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="organisatie", result=self, key="organisatie"
            ),
            after=dict(organisatie=self.organisatie),
        )

    @log_gebruikers_activiteit
    async def mutate(root, _info, **kwargs):
        """ Create the new Organisatie """
        input = kwargs.pop("input")

        Organisatie.unique_kvk_vestigingsnummer(input.kvknummer, input.get("vestigingsnummer"))
        result = hhb_datawriter().organisaties.post(input)

        return CreateOrganisatie(organisatie=result, ok=True)
