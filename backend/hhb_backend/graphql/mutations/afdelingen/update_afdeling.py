""" GraphQL mutation for updating a Afdeling """
import graphene
import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.afdeling import Afdeling
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
    log_gebruikers_activiteit,
)


class UpdateAfdeling(graphene.Mutation):
    class Arguments:
        # hhb_service elements
        id = graphene.Int(required=True)
        

        # org_service elements
        naam = graphene.String()
        organisatie_id = graphene.Int()

    ok = graphene.Boolean()
    afdeling = graphene.Field(lambda: Afdeling)
    previous = graphene.Field(lambda: Afdeling)

    def gebruikers_activiteit(self, _root, info, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="afdeling", result=self, key="afdeling"
            ),
            before=dict(postadres=self.previous),
            after=dict(afdeling=self.afdeling),
        )

    @staticmethod
    @log_gebruikers_activiteit
    async def mutate(_root, _info, id, **kwargs):
        """ Update the current Afdeling """
        previous = hhb_dataloader().afdelingen.load_one(id)
        if not previous:
            raise GraphQLError("Afdeling not found")

        hhb_service_data = {"organisatie_id": previous.organisatie_id}
        if "organisatie_id" in kwargs:
            hhb_service_data["organisatie_id"] = kwargs["organisatie_id"]

        # Try update of huishoudboekje service
        hhb_service_response = requests.post(
            f"{settings.HHB_SERVICES_URL}/afdelingen/{id}",
            json=hhb_service_data,
            headers={"Content-type": "application/json"},
        )
        if hhb_service_response.status_code != 200:
            raise GraphQLError(
                f"Upstream API responded: {hhb_service_response.text}")

        # Try update of organisatie service
        org_service_response = requests.post(
            f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/{id}",
            json=kwargs,
            headers={"Content-type": "application/json"},
        )
        if org_service_response.status_code != 200:
            raise GraphQLError(
                f"Upstream API responded: {org_service_response.text}"
            )

        afdeling = org_service_response.json()["data"]

        return UpdateAfdeling(afdeling=afdeling, previous=previous, ok=True)
