""" GraphQL mutation for creating a new Organisatie """
import os
import json
import graphene
import requests
from graphql import GraphQLError
from hhb_backend.graphql import settings
from hhb_backend.graphql.models.organisatie import Organisatie

class CreateOrganisatie(graphene.Mutation):
    class Arguments:
        # hhb_service elements (required)
        kvk_nummer = graphene.String(required=True)
        weergave_naam = graphene.String(required=True)
        # org_service elements (optional)
        naam = graphene.String()
        straatnaam = graphene.String()
        huisnummer = graphene.String()
        postcode = graphene.String()
        plaatsnaam = graphene.String()

    ok = graphene.Boolean()
    organisatie = graphene.Field(lambda: Organisatie)

    def mutate(root, info, **kwargs):
        """ Create the new Organisatie """
        hhb_service_data = {
            "kvk_nummer": kwargs["kvk_nummer"],
            "weergave_naam": kwargs.pop("weergave_naam")
        }
        hhb_service_response = requests.post(
            os.path.join(settings.HHB_SERVICES_URL, "organisaties/"), 
            data=json.dumps(hhb_service_data),
            headers={'Content-type': 'application/json'}
        )
        if hhb_service_response.status_code != 201:
            raise GraphQLError(f"Upstream API responded: {hhb_service_response.json()}")

        org_service_response = requests.post(
            os.path.join(settings.ORGANISATIE_SERVICES_URL, f"organisaties/"), 
            data=json.dumps(kwargs),
            headers={'Content-type': 'application/json'}
        )
        if org_service_response.status_code != 201:
            raise GraphQLError(f"Upstream API responded: {org_service_response.json()}")

        return CreateOrganisatie(organisatie=hhb_service_response.json()["data"], ok=True)
