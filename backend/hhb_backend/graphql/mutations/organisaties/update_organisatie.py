""" GraphQL mutation for updating a Organisatie """
import os
import graphene
import requests
import json
from graphql import GraphQLError
from hhb_backend.graphql import settings
from hhb_backend.graphql.models.organisatie import Organisatie
from hhb_backend.graphql.mutations.rekening_input import RekeningInput


class UpdateOrganisatie(graphene.Mutation):
    class Arguments:
        # hhb_service elements
        id = graphene.Int(required=True)
        weergave_naam = graphene.String()
        kvk_nummer = graphene.String()
        rekeningen = graphene.List(RekeningInput)

        # org_service elements
        naam = graphene.String()
        straatnaam = graphene.String()
        huisnummer = graphene.String()
        postcode = graphene.String()
        plaatsnaam = graphene.String()

    ok = graphene.Boolean()
    organisatie = graphene.Field(lambda: Organisatie)

    def mutate(root, info, id, **kwargs):
        """ Update the current Organisatie """

        rekeningen = kwargs.pop("rekeningen")

        # First update weergavenaam and get original kvk_number
        hhb_service_data = {}
        if "weergave_naam" in kwargs:
            hhb_service_data["weergave_naam"] = kwargs.pop("weergave_naam")

        hhb_service_response = requests.post(
            f"{settings.HHB_SERVICES_URL}/organisaties/{id}",
            data=json.dumps(hhb_service_data),
            headers={'Content-type': 'application/json'}
        )
        if hhb_service_response.status_code != 202:
            raise GraphQLError(f"Upstream API responded: {hhb_service_response.json()}")
        else:
            orgineel_kvk_nummer = hhb_service_response.json()["data"]["kvk_nummer"]

        # Try update of organisatie service
        if kwargs:
            org_service_response = requests.post(
                f"{settings.ORGANISATIE_SERVICES_URL}/organisaties/{orgineel_kvk_nummer}",
                data=json.dumps(kwargs),
                headers={'Content-type': 'application/json'}
            )
            if org_service_response.status_code != 202:
                raise GraphQLError(f"Upstream API responded: {org_service_response.json()}")

        # Update kvk_nummer in huishoudboekje
        if "kvk_nummer" in kwargs:
            hhb_service_response = requests.post(
                f"{settings.HHB_SERVICES_URL}/organisaties/{id}",
                data=json.dumps({"kvk_nummer": kwargs["kvk_nummer"]}),
                headers={'Content-type': 'application/json'}
            )
            if hhb_service_response.status_code != 202:
                raise GraphQLError(f"Upstream API responded: {hhb_service_response.json()}")

        return UpdateOrganisatie(organisatie=hhb_service_response.json()["data"], ok=True)
