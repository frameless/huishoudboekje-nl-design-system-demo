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


class UpdateAfspraakAutomatischBoeken(graphene.Mutation):
    class Arguments:
        afspraakId = graphene.Int(required=True)
        automatischBoeken = graphene.Boolean(required=True)

    ok = graphene.Boolean()
    afspraak = graphene.Field(lambda: Afspraak)
    previous = graphene.Field(lambda: Afspraak)

    def gebruikers_activiteit(self, _root, info, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="afspraak", result=self, key="afspraak"
            )
            + gebruikers_activiteit_entities(
                entity_type="burger", result=self.afspraak, key="burger_id"
            ),
            before=dict(afspraak=self.previous),
            after=dict(afspraak=self.afspraak),
        )

    @staticmethod
    @log_gebruikers_activiteit
    async def mutate(_root, _info, afspraakId: int, automatischBoeken: bool):
        """ Update the Afspraak """

        previous = await hhb_dataloader().afspraken_by_id.load(afspraakId)

        if previous is None:
            raise GraphQLError("afspraak not found")

        input = {
            **previous,
            "automatisch_boeken": automatischBoeken,
        }
        response = requests.post(
            f"{settings.HHB_SERVICES_URL}/afspraken/{afspraakId}",
            json=input,
        )
        if not response.ok:
            raise GraphQLError(f"Upstream API responded: {response.text}")

        afspraak = response.json()["data"]

        return UpdateAfspraakAutomatischBoeken(afspraak=afspraak, previous=previous, ok=True)
