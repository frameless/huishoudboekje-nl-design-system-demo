""" GraphQL mutation for deleting a Afdeling """
import graphene
import requests
from graphql import GraphQLError

from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
import hhb_backend.graphql.models.afdeling as graphene_afdeling
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity


class DeleteAfdeling(graphene.Mutation):
    """Mutatie om een afdeling van een organisatie te verwijderen."""

    class Arguments:
        # afdeling arguments
        id = graphene.Int(required=True)

    ok = graphene.Boolean()
    previous = graphene.Field(lambda: graphene_afdeling.Afdeling)

    def mutate(self, info, id):
        """ Delete current afdeling """
        previous = hhb_dataloader().afdelingen.load_one(id)
        if not previous:
            raise GraphQLError("Afdeling not found")

        # do not remove when attached postadressen are found
        postadressen_ids = previous.postadressen_ids
        if postadressen_ids:
            raise GraphQLError("Afdeling has postadressen - deletion is not possible.")

        # do not remove when attached rekeningen are found
        rekeningen_ids = previous.rekeningen_ids
        if rekeningen_ids:
            raise GraphQLError("Afdeling has rekeningen - deletion is not possible.")

        # remove afdeling itself
        response_organisatie = requests.delete(f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/{id}")
        if response_organisatie.status_code != 204:
            raise GraphQLError(f"Upstream API responded: {response_organisatie.text}")

        response_hhb = requests.delete(f"{settings.HHB_SERVICES_URL}/afdelingen/{id}")
        if response_hhb.status_code != 204:
            raise GraphQLError(f"Upstream API responded: {response_hhb.text}")

        AuditLogging.create(
            action=info.field_name, 
            entities=[GebruikersActiviteitEntity(entityType="afdeling", entityId=id)],
            before=dict(afdeling=previous)
        )

        return DeleteAfdeling(ok=True, previous=previous)
