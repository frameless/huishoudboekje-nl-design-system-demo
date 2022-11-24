""" GraphQL mutation for deleting a Organisatie """

import graphene
import requests
from graphql import GraphQLError

from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.organisatie import Organisatie
from hhb_backend.graphql.utils.gebruikersactiviteiten import gebruikers_activiteit_entities


class DeleteOrganisatie(graphene.Mutation):
    class Arguments:
        # organisatie arguments
        id = graphene.Int(required=True)

    ok = graphene.Boolean()
    previous = graphene.Field(lambda: Organisatie)

    @staticmethod
    def mutate(self, info, id):
        """ Delete current organisatie """
        previous = hhb_dataloader().organisaties.load_one(id)
        if not previous:
            raise GraphQLError("Organisatie not found")

        afdelingen = hhb_dataloader().afdelingen.by_organisatie(id)
        if afdelingen:
            raise GraphQLError("Organisatie has afdelingen - deletion is not possible.")

        response_organisatie = requests.delete(
            f"{settings.ORGANISATIE_SERVICES_URL}/organisaties/{id}"
        )
        if response_organisatie.status_code not in [204, 404]:
            raise GraphQLError(f"Upstream API responded: {response_organisatie.text}")

        AuditLogging.create(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="organisatie", result=previous
            ),
            before=dict(organisatie=previous),
        )

        return DeleteOrganisatie(ok=True, previous=previous)
