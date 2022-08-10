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


class DeletePostadres(graphene.Mutation):
    class Arguments:
        # postadres arguments
        id = graphene.String(required=True)
        afdeling_id = graphene.Int(required=True)

    ok = graphene.Boolean()
    previous = graphene.Field(lambda: Postadres)
    afdeling = graphene.Field(lambda: Afdeling)

    def gebruikers_activiteit(self, _root, info, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="postadres", result=self, key="previous"
            )
            + gebruikers_activiteit_entities(
                entity_type="afdeling", result=self, key="afdeling"
            ),
            before=dict(postadres=self.previous),
        )

    @log_gebruikers_activiteit
    async def mutate(self, _info, id, afdeling_id):
        """ Delete current postadres """
        previous = hhb_dataloader().postadres_by_id.load(id)
        if not previous:
            raise GraphQLError("postadres not found")

        afspraken = hhb_dataloader().afspraken_by_postadres(id)
        if afspraken:
            raise GraphQLError("Postadres wordt gebruikt in een of meerdere afspraken - verwijderen is niet mogelijk.")

        response_ContactCatalogus = requests.delete(
            f"{settings.POSTADRESSEN_SERVICE_URL}/addresses/{id}"
        )
        if response_ContactCatalogus.status_code != 204:
            raise GraphQLError(f"Upstream API responded: {response_ContactCatalogus.text}")


        # Delete the Id from postadressen_ids column in afdeling
        afdeling = hhb_dataloader().afdeling_by_id.load(afdeling_id)
        afdeling["postadressen_ids"].remove(id)
        afdeling.pop("id")

        # Try update of organisatie service
        org_service_response = requests.post(
            f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/{afdeling_id}",
            json=afdeling,
            headers={"Content-type": "application/json"},
        )
        if org_service_response.status_code != 200:
            raise GraphQLError(
                f"Upstream API responded: {org_service_response.text}"
            )

        new_afdeling = org_service_response.json()['data']

        return DeletePostadres(ok=True, previous=previous, afdeling=new_afdeling)