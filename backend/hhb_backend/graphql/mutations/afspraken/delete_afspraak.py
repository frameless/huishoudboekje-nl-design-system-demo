""" GraphQL mutation for deleting a Afspraak """

import graphene
import requests
from graphql import GraphQLError

from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
import hhb_backend.graphql.models.afspraak as graphene_afspraak
from hhb_backend.graphql.utils.gebruikersactiviteiten import gebruikers_activiteit_entities


class DeleteAfspraak(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)

    ok = graphene.Boolean()

    previous = graphene.Field(lambda: graphene_afspraak.Afspraak)

    @staticmethod
    def mutate(self, info, id):
        """ Delete current afspraak """
        previous = hhb_dataloader().afspraken.load_one(id)
        if not previous:
            raise GraphQLError("Afspraak not found")

        # Check if afspraak in use by journaalposten
        if previous.journaalposten:
            raise GraphQLError("Afspraak is linked to one or multiple journaalposten - deletion is not possible.")

        response = requests.delete(f"{settings.HHB_SERVICES_URL}/afspraken/{id}")
        if response.status_code != 204:
            raise GraphQLError(f"Upstream API responded: {response.text}")

        AuditLogging.create(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="afspraak", result=previous
            ) + gebruikers_activiteit_entities(
                entity_type="burger", result=previous, key="burger_id"
            ) + gebruikers_activiteit_entities(
                entity_type="afdeling", result=previous, key="afdeling_id"
            ),
            before=dict(afspraak=previous),
        )

        return DeleteAfspraak(ok=True, previous=dict(previous))
