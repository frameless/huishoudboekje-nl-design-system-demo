""" GraphQL mutation for creating a new Organisatie """
import json
import graphene
import requests
from graphql import GraphQLError
from hhb_backend.graphql import settings
from hhb_backend.graphql.models.organisatie import Organisatie

import hhb_backend.graphql.mutations.rekeningen.rekening_input as rekening_input
from hhb_backend.graphql.mutations.rekeningen.utils import create_organisatie_rekening
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
    log_gebruikers_activiteit,
)


class CreateOrganisatieInput(graphene.InputObjectType):
    # hhb_service elements (required)
    kvk_nummer = graphene.String(required=True)
    rekeningen = graphene.List(lambda: rekening_input.RekeningInput)
    vestigingsnummer = graphene.Int()

    # org_service elements (optional)
    naam = graphene.String()
    straatnaam = graphene.String()
    huisnummer = graphene.String()
    postcode = graphene.String()
    plaatsnaam = graphene.String()


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
        rekeningen = input.pop("rekeningen", None)

        hhb_service_data = {
            "kvk_nummer": input["kvk_nummer"],
            "vestigingsnummer": input["vestigingsnummer"],
        }
        hhb_service_response = requests.post(
            f"{settings.HHB_SERVICES_URL}/organisaties/",
            data=json.dumps(hhb_service_data),
            headers={"Content-type": "application/json"},
        )
        if hhb_service_response.status_code != 201:
            raise GraphQLError(f"Upstream API responded: {hhb_service_response.json()}")

        org_service_response = requests.post(
            f"{settings.ORGANISATIE_SERVICES_URL}/organisaties/",
            data=json.dumps(input),
            headers={"Content-type": "application/json"},
        )
        if org_service_response.status_code != 201:
            raise GraphQLError(f"Upstream API responded: {org_service_response.json()}")

        result = hhb_service_response.json()["data"]

        if rekeningen:
            result["rekeningen"] = [
                create_organisatie_rekening(result["id"], rekening)
                for rekening in rekeningen
            ]

        return CreateOrganisatie(organisatie=result, ok=True)
