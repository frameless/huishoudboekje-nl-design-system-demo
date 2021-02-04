""" GraphQL mutation for updating an Afspraak """

import graphene
import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.afspraak import Afspraak
from hhb_backend.graphql.mutations.afspraken import AfspraakInput
from hhb_backend.graphql.utils import convert_hhb_interval_to_iso
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    log_gebruikers_activiteit,
    gebruikers_activiteit_entities,
)


class UpdateAfspraak(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        input = graphene.Argument(AfspraakInput, required=True)

    ok = graphene.Boolean()
    afspraak = graphene.Field(lambda: Afspraak)
    previous = graphene.Field(lambda: Afspraak)

    @property
    def gebruikers_activiteit(self):
        return dict(
            action="updateAfspraak",
            entities=gebruikers_activiteit_entities(
                entity_type="afspraak", result=self, key="afspraak"
            )
            + gebruikers_activiteit_entities(
                entity_type="burger", result=self.afspraak, key="gebruiker_id"
            )
            + gebruikers_activiteit_entities(
                entity_type="organisatie", result=self.afspraak, key="organisatie_id"
            ),
            before=dict(afspraak=self.previous),
            after=dict(afspraak=self.afspraak),
        )

    @log_gebruikers_activiteit
    async def mutate(root, info, id, input, **kwargs):
        """ Update the Afspraak """

        previous = await hhb_dataloader().afspraken_by_id.load(id)

        if "interval" in input:
            iso_interval = convert_hhb_interval_to_iso(input["interval"])
            input["interval"] = iso_interval

        response = requests.post(
            f"{settings.HHB_SERVICES_URL}/afspraken/{id}",
            json=input,
        )
        if not response.ok:
            raise GraphQLError(f"Upstream API responded: {response.json()}")

        afspraak = response.json()["data"]

        return UpdateAfspraak(afspraak=afspraak, previous=previous, ok=True)
