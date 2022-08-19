""" GraphQL mutation for adding an Afspraak zoekterm """

import graphene
import pydash
import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models import afspraak
from hhb_backend.graphql.utils.gebruikersactiviteiten import (gebruikers_activiteit_entities, log_gebruikers_activiteit)
from hhb_backend.processen.automatisch_boeken import find_matching_afspraken_by_afspraak


class AddAfspraakZoekterm(graphene.Mutation):
    """Mutatie om een zoekterm aan een afspraak toe te voegen."""
    class Arguments:
        afspraak_id = graphene.Int(required=True)
        zoekterm = graphene.String(required=True)

    ok = graphene.Boolean()
    afspraak = graphene.Field(lambda: afspraak.Afspraak)
    previous = graphene.Field(lambda: afspraak.Afspraak)
    matching_afspraken = graphene.List(lambda: afspraak.Afspraak)

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
    async def mutate(_root, _info, afspraak_id: int, zoekterm):
        """ Add zoekterm to afspraak """

        previous = hhb_dataloader().afspraken.load_one(afspraak_id)

        if previous is None:
            raise GraphQLError("Afspraak not found")

        # These arrays contains ids for their entities and not the instances, the hhb_service does not understand that,
        # Since removing them from the payload makes the service ignore them for updating purposes it is safe to remove
        # them here.
        previous = pydash.omit(previous, 'journaalposten', 'overschrijvingen')

        if previous["zoektermen"]:
            zoektermen = list(previous["zoektermen"])
        else:
            zoektermen = list()

        if zoekterm.lower() in (zk.lower() for zk in zoektermen):
            raise GraphQLError("Zoekterm already in zoektermen")

        zoektermen.append(zoekterm)

        input = {
            **previous,
            "zoektermen": zoektermen
        }

        response = requests.post(
            f"{settings.HHB_SERVICES_URL}/afspraken/{afspraak_id}",
            json=input,
        )
        if not response.ok:
            raise GraphQLError(f"Upstream API responded: {response.text}")

        afspraak = response.json()["data"]

        matching_afspraken = await find_matching_afspraken_by_afspraak(afspraak)

        return AddAfspraakZoekterm(afspraak=afspraak, previous=previous, matching_afspraken=matching_afspraken, ok=True)
