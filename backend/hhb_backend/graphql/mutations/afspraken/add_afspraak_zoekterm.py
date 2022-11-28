""" GraphQL mutation for adding an Afspraak zoekterm """

import graphene
import requests
from graphql import GraphQLError

from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
import hhb_backend.graphql.models.afspraak as graphene_afspraak
from hhb_backend.graphql.utils.find_matching_afspraken import find_matching_afspraken_by_afspraak
from hhb_backend.graphql.utils.gebruikersactiviteiten import gebruikers_activiteit_entities
from hhb_backend.service.model.afspraak import Afspraak


class AddAfspraakZoekterm(graphene.Mutation):
    """Mutatie om een zoekterm aan een afspraak toe te voegen."""

    class Arguments:
        afspraak_id = graphene.Int(required=True)
        zoekterm = graphene.String(required=True)

    ok = graphene.Boolean()
    afspraak = graphene.Field(lambda: graphene_afspraak.Afspraak)
    previous = graphene.Field(lambda: graphene_afspraak.Afspraak)
    matching_afspraken = graphene.List(lambda: graphene_afspraak.Afspraak)

    @staticmethod
    def mutate(root, info, afspraak_id: int, zoekterm):
        """ Add zoekterm to afspraak """

        previous: Afspraak = hhb_dataloader().afspraken.load_one(afspraak_id)
        if previous is None:
            raise GraphQLError("Afspraak not found")

        zoektermen = previous.zoektermen
        if zoekterm.lower() in (zk.lower() for zk in zoektermen):
            raise GraphQLError("Zoekterm already exists")

        zoektermen.append(zoekterm)

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

        AuditLogging.create(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="afspraak", result=afspraak
            ) + gebruikers_activiteit_entities(
                entity_type="burger", result=afspraak, key="burger_id"
            ),
            before=dict(afspraak=previous),
            after=dict(afspraak=afspraak),
        )

        return AddAfspraakZoekterm(afspraak=afspraak, previous=previous, matching_afspraken=matching_afspraken, ok=True)
