""" GraphQL mutation for deleting a Afdeling """
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
from hhb_backend.graphql.mutations.rekeningen.utils import (
    disconnect_afdeling_rekening,
    delete_rekening,
)
import logging

class DeleteAfdeling(graphene.Mutation):
    """Mutatie om een afdeling van een organisatie te verwijderen."""

    class Arguments:
        # afdeling arguments
        id = graphene.Int(required=True)

    ok = graphene.Boolean()
    previous = graphene.Field(lambda: Afdeling)

    def gebruikers_activiteit(self, _root, info, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="afdeling", result=self, key="previous"
            ),
            before=dict(afdeling=self.previous),
        )

    @log_gebruikers_activiteit
    async def mutate(root, _info, id):
        """ Delete current afdeling """
        previous = await hhb_dataloader().afdelingen_by_id.load(id)
        if not previous:
            raise GraphQLError("Afdeling not found")

        # remove attached postadressen
        postadressen_ids = previous.get("postadressen_ids")
        if postadressen_ids:
            for postadres_id in postadressen_ids:
                response_ContactCatalogus = requests.delete(
                    f"{settings.POSTADRESSEN_SERVICE_URL}/addresses/{postadres_id}",
                    headers={"Authorization": "45c1a4b6-59d3-4a6e-86bf-88a872f35845"}
                )
                if response_ContactCatalogus.status_code != 204:
                    raise GraphQLError(f"Upstream API responded: {response_ContactCatalogus.text}")

        # remove attached rekeningen
        rekeningen_ids = previous.get("rekeningen_ids")
        afdeling_id = previous.get("id")
        logging.getLogger(f"wouter-logger").warning(f"-->>>> rekeningen to remove: {rekeningen_ids} for afdeling: {afdeling_id}")
        if rekeningen_ids and afdeling_id:
            for rekening_id in rekeningen_ids:
                logging.getLogger(f"wouter-logger").warning(f"-->>>> disconnect afdeling:{afdeling_id} and rekening:{rekening_id}")
                disconnect_afdeling_rekening(afdeling_id, rekening_id)
                delete_rekening(rekening_id)

        # remove afdeling itself
        response_organisatie = requests.delete(f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/{id}")
        if response_organisatie.status_code != 204:
            raise GraphQLError(f"Upstream API responded: {response_organisatie.text}")

        response_hhb = requests.delete(f"{settings.HHB_SERVICES_URL}/afdelingen/{id}")
        if response_hhb.status_code != 204:
            raise GraphQLError(f"Upstream API responded: {response_hhb.text}")

        return DeleteAfdeling(ok=True, previous=previous)
