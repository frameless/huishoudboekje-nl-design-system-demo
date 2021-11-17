""" GraphQL mutation for creating a new Organisatie """
import json
import graphene
import requests
from graphql import GraphQLError
from hhb_backend.graphql import settings
from hhb_backend.graphql.models.organisatie import Organisatie

import hhb_backend.graphql.mutations.rekeningen.rekening_input as rekening_input
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

        Organisatie().unique_kvk_vestigingsnummer(input.get("kvknummer"), input.get("vestigingsnummer"))

        org_service_response = requests.post(
            f"{settings.ORGANISATIE_SERVICES_URL}/organisaties/",
            data=json.dumps(input),
            headers={"Content-type": "application/json"},
        )
        if org_service_response.status_code != 201:
            raise GraphQLError(f"Upstream API responded: {org_service_response.json()}")

        result = org_service_response.json()["data"]

        return CreateOrganisatie(organisatie=result, ok=True)
