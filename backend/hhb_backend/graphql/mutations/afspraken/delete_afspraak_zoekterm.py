""" GraphQL mutation for adding an Afspraak zoekterm """

import graphene
import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
import hhb_backend.graphql.models.afspraak as graphene_afspraak
from hhb_backend.graphql.utils.find_matching_afspraken import find_matching_afspraken_by_afspraak
from hhb_backend.graphql.utils.gebruikersactiviteiten import (gebruikers_activiteit_entities, log_gebruikers_activiteit)
from hhb_backend.service.model.afspraak import Afspraak


class DeleteAfspraakZoekterm(graphene.Mutation):
    """Mutatie om een zoekterm bij een afspraak te verwijderen."""
    class Arguments:
        afspraak_id = graphene.Int(required=True)
        zoekterm = graphene.String(required=True)

    ok = graphene.Boolean()
    afspraak = graphene.Field(lambda: graphene_afspraak.Afspraak)
    previous = graphene.Field(lambda: graphene_afspraak.Afspraak)
    matching_afspraken = graphene.List(lambda: graphene_afspraak.Afspraak)

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
    def mutate(_root, _info, afspraak_id: int, zoekterm):
        """ Delete zoekterm to afspraak """

        previous = hhb_dataloader().afspraken.load_one(afspraak_id)

        if previous is None:
            raise GraphQLError("Afspraak not found")

        zoektermen = previous.zoektermen
        if zoekterm.lower() in (zk.lower() for zk in zoektermen):
            zoektermen.remove(zoekterm)
        else:
            raise GraphQLError("Zoekterm not found in zoektermen of afspraak.")

        input = {
            "zoektermen": zoektermen
        }

        response = requests.post(
            f"{settings.HHB_SERVICES_URL}/afspraken/{afspraak_id}",
            json=input,
        )
        if not response.ok:
            raise GraphQLError(f"Upstream API responded: {response.text}")

        afspraak = Afspraak(response.json()["data"])

        matching_afspraken = find_matching_afspraken_by_afspraak(afspraak)

        return DeleteAfspraakZoekterm(afspraak=afspraak, previous=previous, matching_afspraken=matching_afspraken, ok=True)
