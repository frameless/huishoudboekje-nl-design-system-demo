import graphene
import requests
from deprecated import deprecated
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.journaalpost import Journaalpost
from hhb_backend.graphql.utils.gebruikersactiviteiten import (gebruikers_activiteit_entities, log_gebruikers_activiteit)


class UpdateJournaalpostGrootboekrekeningInput(graphene.InputObjectType):
    id = graphene.Int(required=True)
    grootboekrekening_id = graphene.String(required=True)

@deprecated("No longer used")
class UpdateJournaalpostGrootboekrekening(graphene.Mutation):
    """deprecated"""
    class Arguments:
        input = graphene.Argument(UpdateJournaalpostGrootboekrekeningInput)

    ok = graphene.Boolean()
    journaalpost = graphene.Field(lambda: Journaalpost)
    previous = graphene.Field(lambda: Journaalpost)

    def gebruikers_activiteit(self, _root, info, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="journaalpost", result=self, key="journaalpost"
            )
            + gebruikers_activiteit_entities(
                entity_type="grootboekrekening",
                result=self.journaalpost,
                key="grootboekrekening_id",
            )
            + gebruikers_activiteit_entities(
                entity_type="transaction", result=self.journaalpost, key="transaction"
            ),
            before=dict(journaalpost=self.previous),
            after=dict(journaalpost=self.journaalpost),
        )

    @staticmethod
    @log_gebruikers_activiteit
    async def mutate(_root, _info, input, **_kwargs):
        """ Create the new Journaalpost """

        previous: Journaalpost = hhb_dataloader().journaalpost_by_id.load(
            input.get("id")
        )

        # Validate that the references exist
        if not previous:
            raise GraphQLError(f"journaalpost not found")

        if previous.afspraak:
            raise GraphQLError("journaalpost already connected to an afspraak")

        grootboekrekening = hhb_dataloader().grootboekrekeningen_by_id.load(
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
