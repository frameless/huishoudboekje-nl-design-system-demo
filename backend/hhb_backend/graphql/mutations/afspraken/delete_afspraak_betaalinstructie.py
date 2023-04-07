""" GraphQL mutation for deleting an Afspraak Betaalinstructie """

import logging
import graphene
import requests

from graphql import GraphQLError
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models import afspraak
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity


class DeleteAfspraakBetaalinstructie(graphene.Mutation):
    """Mutatie om een betaalinstructie bij een afspraak te verwijderen."""

    class Arguments:
        afspraak_id = graphene.Int(required=True)

    ok = graphene.Boolean()
    afspraak = graphene.Field(lambda: afspraak.Afspraak)
    previous = graphene.Field(lambda: afspraak.Afspraak)

    @staticmethod
    def mutate(self, info, afspraak_id: int):
        """ Update the Afspraak """
        logging.info(f"Updating afspraak: {afspraak_id}")

        previous = hhb_dataloader().afspraken.load_one(afspraak_id)

        if previous is None:
            raise GraphQLError("Afspraak not found")

        # These arrays contains ids for their entities and not the instances, the hhb_service does not understand that,
        # Since removing them from the payload makes the service ignore them for updating purposes it is safe to remove
        # them here.
        del previous.journaalposten
        del previous.overschrijvingen

        input = {
            "betaalinstructie": None
        }

        response = requests.post(
            f"{settings.HHB_SERVICES_URL}/afspraken/{afspraak_id}",
            json=input,
        )
        if not response.ok:
            raise GraphQLError(f"Upstream API responded: {response.text}")

        afspraak = response.json()["data"]

        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="afspraak", entityId=afspraak_id),
                GebruikersActiviteitEntity(entityType="burger", entityId=afspraak["burger_id"])
            ],
            before=dict(afspraak=previous),
            after=dict(afspraak=afspraak),
        )

        return DeleteAfspraakBetaalinstructie(afspraak=afspraak, previous=previous, ok=True)
