""" GraphQL mutation for adding an Afspraak zoekterm """

import logging
import graphene
import requests
from graphql import GraphQLError

from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
import hhb_backend.graphql.models.afspraak as graphene_afspraak
from hhb_backend.graphql.utils.find_matching_afspraken import find_matching_afspraken_by_afspraak
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity
from hhb_backend.service.model.afspraak import Afspraak
from hhb_backend.graphql.mutations.json_input_validator import JsonInputValidator


class DeleteAfspraakZoekterm(graphene.Mutation):
    """Mutatie om een zoekterm bij een afspraak te verwijderen."""

    class Arguments:
        afspraak_id = graphene.Int(required=True)
        zoekterm = graphene.String(required=True)

    ok = graphene.Boolean()
    afspraak = graphene.Field(lambda: graphene_afspraak.Afspraak)
    previous = graphene.Field(lambda: graphene_afspraak.Afspraak)
    matching_afspraken = graphene.List(lambda: graphene_afspraak.Afspraak)

    @staticmethod
    def mutate(self, info, afspraak_id: int, zoekterm):
        """ Delete zoekterm to afspraak """
        logging.info(f"Updating afspraak: {afspraak_id}")

        validation_schema = {"type": "string","minLength": 1}
        JsonInputValidator(validation_schema).validate(zoekterm)

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

        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="afspraak", entityId=afspraak_id),
                GebruikersActiviteitEntity(entityType="burger", entityId=afspraak["burger_id"])
            ],
            before=dict(afspraak=previous),
            after=dict(afspraak=afspraak),
        )

        return DeleteAfspraakZoekterm(afspraak=afspraak, previous=previous, matching_afspraken=matching_afspraken,
                                      ok=True)
