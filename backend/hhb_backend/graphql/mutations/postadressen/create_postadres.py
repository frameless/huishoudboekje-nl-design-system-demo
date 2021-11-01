""" GraphQL mutation for creating a new Postadres """
import json
import graphene
import requests
from graphql import GraphQLError
from hhb_backend.graphql import settings
from hhb_backend.graphql.models.postadres import Postadres
from hhb_backend.graphql.models.afdeling import Afdeling
from hhb_backend.graphql.dataloaders import hhb_dataloader

from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
    log_gebruikers_activiteit,
)

class CreatePostadresInput(graphene.InputObjectType):
    # hhb_service elements (required)
    straatnaam = graphene.String(required=True)
    huisnummer = graphene.String(required=True)
    postcode = graphene.String(required=True)
    plaatsnaam = graphene.String(required=True)
    afdeling_id = graphene.Int(required=True)

class CreatePostadres(graphene.Mutation):
    class Arguments:
        input = graphene.Argument(CreatePostadresInput)

    ok = graphene.Boolean()
    postadres = graphene.Field(lambda: Postadres)
    afdeling = graphene.Field(lambda: Afdeling)

    def gebruikers_activiteit(self, _root, info, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="postadres", result=self, key="postadres"
            )
            + gebruikers_activiteit_entities(
                entity_type="afdeling", result=self, key="afdeling"
            ),
            after=dict(postadres=self.postadres),
        )

    @log_gebruikers_activiteit
    async def mutate(root, _info, **kwargs):
        """ Create the new Postadres """
        input = kwargs.pop("input")

        ## check if afdeling exists
        previous_afdeling = await hhb_dataloader().afdelingen_by_id.load(input.get('afdeling_id'))
        if not previous_afdeling:
            raise GraphQLError("Afdeling not found")

        contactCatalogus_input = {
            "street": input.get("straatnaam"),
            "houseNumber": input.get("huisnummer"),
            "postalCode": input.get("postcode"),
            "locality": input.get("plaatsnaam")
        }

        contactCatalogus_response = requests.post(
            f"{settings.CONTACTCATALOGUS_SERVICE_URL}/addresses",
            data=json.dumps(contactCatalogus_input),
            headers={"Authorization": "45c1a4b6-59d3-4a6e-86bf-88a872f35845","Content-type": "application/json"}
        )
        if contactCatalogus_response.status_code != 201:
            raise GraphQLError(f"Upstream API responded: {contactCatalogus_response.json()}")

        result = contactCatalogus_response.json()

        if previous_afdeling["postadressen_ids"]:
            postadressen_ids = list(previous_afdeling["postadressen_ids"])
        else:
            postadressen_ids = list()

        postadressen_ids.append(result['id'])

        afdeling_input = {
            **previous_afdeling,
            "postadressen_ids": postadressen_ids
        }

        update_afdeling_response = requests.post(
            f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/{input.get('afdeling_id')}",
            json=afdeling_input,
            headers={"Content-type": "application/json"},
        )
        if update_afdeling_response.status_code != 200:
            raise GraphQLError(
                f"Upstream API responded: {update_afdeling_response.json()}"
            )

        new_afdeling = update_afdeling_response.json()["data"]

        return CreatePostadres(postadres=result, afdeling=new_afdeling, ok=True)
