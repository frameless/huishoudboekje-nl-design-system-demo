import json

import graphene
import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.journaalpost import Journaalpost
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    log_gebruikers_activiteit,
    gebruikers_activiteit_entities,
)


class UpdateJournaalpostGrootboekrekeningInput(graphene.InputObjectType):
    id = graphene.Int(required=True)
    grootboekrekening_id = graphene.String(required=True)


class UpdateJournaalpostGrootboekrekening(graphene.Mutation):
    """Update a Journaalpost with a Grootboekrekening"""

    class Arguments:
        input = graphene.Argument(UpdateJournaalpostGrootboekrekeningInput)

    ok = graphene.Boolean()
    journaalpost = graphene.Field(lambda: Journaalpost)
    previous = graphene.Field(lambda: Journaalpost)

    @property
    def gebruikers_activiteit(self):
        return dict(
            action="Update",
            entities=gebruikers_activiteit_entities(
                result=self, key="journaalpost", entity_type="journaalpost"
            )
            + gebruikers_activiteit_entities(
                result=self.journaalpost, key="afspraak", entity_type="afspraak"
            )
            + gebruikers_activiteit_entities(
                result=self.journaalpost, key="transaction", entity_type="transaction"
            ),
            before=dict(journaalpost=self.previous),
            after=dict(journaalpost=self.journaalpost),
        )

    @log_gebruikers_activiteit
    async def mutate(root, info, input, **kwargs):
        """ Create the new Journaalpost """

        previous: Journaalpost = await hhb_dataloader().journaalposten_by_id.load(
            input.get("id")
        )

        # Validate that the references exist
        if not previous:
            raise GraphQLError(f"journaalpost not found")

        if previous.afspraak:
            raise GraphQLError("journaalpost already connected to an afspraak")

        grootboekrekening = await hhb_dataloader().grootboekrekeningen_by_id.load(
            input.get("grootboekrekening_id")
        )
        if not grootboekrekening:
            raise GraphQLError("grootboekrekening not found")

        if not (grootboekrekening["credit"] == previous.transaction["is_credit"]):
            raise GraphQLError(
                f"credit in grootboekrekening and transaction do not match"
            )

        response = requests.post(
            f"{settings.HHB_SERVICES_URL}/journaalposten/{input.get('id')}",
            json=input,
        )
        if not response.ok:
            raise GraphQLError(f"Upstream API responded: {response.text}")
        journaalpost = response.json()["data"]

        return UpdateJournaalpostGrootboekrekening(
            journaalpost=journaalpost, ok=True, previous=previous
        )
