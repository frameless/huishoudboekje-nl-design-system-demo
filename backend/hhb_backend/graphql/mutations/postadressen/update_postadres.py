""" GraphQL mutation for updating a Postadres """
import os
import graphene
import requests
import json
from graphql import GraphQLError
from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.postadres import Postadres
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
    log_gebruikers_activiteit,
)


class UpdatePostadres(graphene.Mutation):
    class Arguments:
        id = graphene.String(required=True)

        straatnaam = graphene.String()
        huisnummer = graphene.String()
        postcode = graphene.String()
        plaatsnaam = graphene.String()

    ok = graphene.Boolean()
    postadres = graphene.Field(lambda: Postadres)
    previous = graphene.Field(lambda: Postadres)

    def gebruikers_activiteit(self, _root, info, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="postadres", result=self, key="postadres"
            ),
            before=dict(postadres=self.previous),
            after=dict(postadres=self.postadres),
        )

    @staticmethod
    @log_gebruikers_activiteit
    async def mutate(_root, _info, id, **kwargs):
        """ Update the current Postadres """
        previous = await hhb_dataloader().postadressen_by_id.auth_load(id)
        if not previous:
            raise GraphQLError("Postadres not found")

        contactCatalogus_input = {
            "street": kwargs.get("straatnaam", previous['street']),
            "houseNumber": kwargs.get("huisnummer", previous['houseNumber']),
            "postalCode": kwargs.get("postcode", previous['postalCode']),
            "locality": kwargs.get("plaatsnaam", previous['locality'])
        }

        # Try update of contactCatalogus service
        contactCatalogus_response = requests.put(
            f"{settings.CONTACTCATALOGUS_SERVICE_URL}/addresses/{id}",
            json=contactCatalogus_input,
            headers={"Authorization": "45c1a4b6-59d3-4a6e-86bf-88a872f35845",
                     "Content-type": "application/json"},
        )
        if contactCatalogus_response.status_code != 200:
            raise GraphQLError(
                f"Upstream API responded: {contactCatalogus_response.text}"
            )

        postadres = contactCatalogus_response.json()

        return UpdatePostadres(postadres=postadres, previous=previous, ok=True)
