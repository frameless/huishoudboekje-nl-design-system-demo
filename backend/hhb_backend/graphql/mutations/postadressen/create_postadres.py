""" GraphQL mutation for creating a new Postadres """
import graphene
import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.afdeling import Afdeling
from hhb_backend.graphql.models.postadres import Postadres
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
    afdeling_id = graphene.Int()

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
        previous_afdeling = hhb_dataloader().afdeling_by_id.load(input.get('afdeling_id'))
        if not previous_afdeling:
            raise GraphQLError("Afdeling not found")

        street = input.get("straatnaam")
        houseNumber = input.get("huisnummer")
        postalCode = input.get("postcode")
        locality = input.get("plaatsnaam")
        contactCatalogus_input = {
            "street": street,
            "houseNumber": houseNumber,
            "postalCode": postalCode,
            "locality": locality
        }

        contactCatalogus_response = requests.post(
            f"{settings.POSTADRESSEN_SERVICE_URL}/addresses",
            json=contactCatalogus_input, 
            headers={"Accept": "application/json"}
        )
        if contactCatalogus_response.status_code != 201:
            raise GraphQLError(f"Upstream API responded: {contactCatalogus_response.json()}")

        result = contactCatalogus_response.json()['data']

        if previous_afdeling["postadressen_ids"]:
            postadressen_ids = list(previous_afdeling["postadressen_ids"])
        else:
            postadressen_ids = list()

        postadressen_ids.append(result['id'])

        afdeling_input = {
            **previous_afdeling,
            "postadressen_ids": postadressen_ids
        }

        afdeling_id = input.get('afdeling_id')
        update_afdeling_response = requests.post(
            f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/{afdeling_id}",
            json=afdeling_input,
            headers={"Content-type": "application/json"},
        )
        if update_afdeling_response.status_code != 200:
            raise GraphQLError(
                f"Upstream API responded: {update_afdeling_response.json()}"
            )

        new_afdeling = update_afdeling_response.json()["data"]

        return CreatePostadres(postadres=result, afdeling=new_afdeling, ok=True)
