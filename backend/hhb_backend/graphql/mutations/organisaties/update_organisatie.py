""" GraphQL mutation for updating a Organisatie """
import os
import graphene
import requests
import json
from graphql import GraphQLError
from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.organisatie import Organisatie
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
    log_gebruikers_activiteit,
)


class UpdateOrganisatie(graphene.Mutation):
    class Arguments:
        # hhb_service elements
        id = graphene.Int(required=True)
        kvk_nummer = graphene.String()
        vestigingsnummer = graphene.String()

        # org_service elements
        naam = graphene.String()
        straatnaam = graphene.String()
        huisnummer = graphene.String()
        postcode = graphene.String()
        plaatsnaam = graphene.String()

    ok = graphene.Boolean()
    organisatie = graphene.Field(lambda: Organisatie)
    previous = graphene.Field(lambda: Organisatie)

    def gebruikers_activiteit(self, _root, info, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="organisatie", result=self, key="organisatie"
            ),
            before=dict(organisatie=self.previous),
            after=dict(organisatie=self.organisatie),
        )

    @staticmethod
    @log_gebruikers_activiteit
    async def mutate(_root, _info, id, **kwargs):
        """ Update the current Organisatie """
        previous = await hhb_dataloader().organisaties_by_id.load(id)
        if not previous:
            raise GraphQLError("Organisatie not found")

        orgineel_kvk_nummer = previous["kvk_nummer"]
        previous["kvk_details"] = await hhb_dataloader().organisaties_kvk_details.load(
            orgineel_kvk_nummer
        )

        hhb_service_data = {}
        if "kvk_nummer" in kwargs:
            hhb_service_data["kvk_nummer"] = kwargs["kvk_nummer"]
        if "vestigingsnummer" in kwargs:
            hhb_service_data["vestigingsnummer"] = kwargs["vestigingsnummer"]

        # Try update of huishoudboekje service
        hhb_service_response = requests.post(
            f"{settings.HHB_SERVICES_URL}/organisaties/{id}",
            json=hhb_service_data,
        )
        if hhb_service_response.status_code != 200:
            raise GraphQLError(f"Upstream API responded: {hhb_service_response.text}")

        # Try update of organisatie service
        if kwargs:
            org_service_response = requests.post(
                f"{settings.ORGANISATIE_SERVICES_URL}/organisaties/{orgineel_kvk_nummer}",
                json=kwargs,
            )
            if org_service_response.status_code != 200:
                raise GraphQLError(
                    f"Upstream API responded: {org_service_response.text}"
                )

        organisatie = hhb_service_response.json()["data"]
        organisatie["kvk_details"] = org_service_response.json()["data"]

        return UpdateOrganisatie(organisatie=organisatie, previous=previous, ok=True)
