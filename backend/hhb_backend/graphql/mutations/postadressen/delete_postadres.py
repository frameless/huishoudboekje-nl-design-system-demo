import logging
import graphene
import requests

import hhb_backend.graphql.models.afdeling as graphene_afdeling
import hhb_backend.graphql.models.postadres as graphene_postadres
from graphql import GraphQLError
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader


class DeletePostadres(graphene.Mutation):
    class Arguments:
        # postadres arguments
        id = graphene.String(required=True)
        afdeling_id = graphene.Int(required=True)

    ok = graphene.Boolean()
    previous = graphene.Field(lambda: graphene_postadres.Postadres)
    afdeling = graphene.Field(lambda: graphene_afdeling.Afdeling)

    @staticmethod
    def mutate(self, info, id, afdeling_id):
        """ Delete current postadres """
        logging.info(f"Deleting postadres {id}")
        previous = hhb_dataloader().postadressen.load_one(id)
        if not previous:
            raise GraphQLError("postadres not found")

        afspraken = hhb_dataloader().afspraken.by_postadres(id)
        if afspraken:
            raise GraphQLError("Postadres is used in one or multiple afspraken - deletion is not possible.")

        postadres_response = requests.delete(
            f"{settings.POSTADRESSEN_SERVICE_URL}/addresses/{id}"
        )
        if postadres_response.status_code != 204:
            raise GraphQLError(f"Upstream API responded: {postadres_response.text}")

        # Delete the Id from postadressen_ids column in afdeling
        afdeling = hhb_dataloader().afdelingen.load_one(afdeling_id)
        afdeling.postadressen_ids.remove(id)
        del afdeling.id

        # Try update of organisatie service
        org_service_response = requests.post(
            f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/{afdeling_id}",
            json=afdeling,
            headers={"Content-type": "application/json"},
        )
        if org_service_response.status_code != 200:
            raise GraphQLError(
                f"Upstream API responded: {org_service_response.text}"
            )

        new_afdeling = org_service_response.json()['data']

        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="postadres", entityId=id),
                GebruikersActiviteitEntity(entityType="afdeling", entityId=afdeling_id),
            ],
            before=dict(postadres=previous),
        )

        return DeletePostadres(ok=True, previous=previous, afdeling=new_afdeling)
