""" GraphQL mutation for deleting a Rubriek """

import graphene
import requests
from graphql import GraphQLError

from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.rubriek import Rubriek
from hhb_backend.graphql.utils.gebruikersactiviteiten import gebruikers_activiteit_entities, GebruikersActiviteitEntity


class DeleteRubriek(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)

    ok = graphene.Boolean()
    previous = graphene.Field(lambda: Rubriek)

    @staticmethod
    def mutate(self, info, id):
        """ Delete current rubriek """
        previous = hhb_dataloader().rubrieken.load_one(id)

        # Check if in use by afspraken
        afspraken = previous.afspraken
        if afspraken:
            raise GraphQLError("Rubriek is used in one or multiple afspraken - deletion is not possible.")

        # Check if in use by journaalposten
        grootboekrekening_id = previous.grootboekrekening_id
        if grootboekrekening_id:
            journaalposten = hhb_dataloader().journaalposten.by_grootboekrekening(grootboekrekening_id)
            if journaalposten:
                raise GraphQLError(
                    "Rubriek is part of grootboekrekening that is used by journaalposten - deletion is not possible.")

        delete_response = requests.delete(f"{settings.HHB_SERVICES_URL}/rubrieken/{id}")
        if delete_response.status_code != 204:
            raise GraphQLError(f"Upstream API responded: {delete_response.json()}")

        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="rubriek", entityId=id),
            ],
            after=dict(rubriek=previous),
        )

        return DeleteRubriek(ok=True, previous=previous)
