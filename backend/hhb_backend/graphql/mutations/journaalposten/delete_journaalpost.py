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


class DeleteJournaalpost(graphene.Mutation):
    """ Delete journaalpost by id """

    class Arguments:
        id = graphene.Int(required=True)

    ok = graphene.Boolean()
    previous = graphene.Field(lambda: Journaalpost)

    @property
    def gebruikers_activiteit(self):
        return dict(
            action="Delete",
            entities=gebruikers_activiteit_entities(
                result=self, key="previous", entity_type="journaalpost"
            )
            + gebruikers_activiteit_entities(
                result=self.previous, key="afspraak", entity_type="afspraak"
            )
            + gebruikers_activiteit_entities(
                result=self.previous, key="transaction", entity_type="transaction"
            ),
            before=dict(journaalpost=self.previous),
        )

    @log_gebruikers_activiteit
    async def mutate(root, info, id):
        previous = await hhb_dataloader().journaalposten_by_id.load(id)

        response = requests.delete(f"{settings.HHB_SERVICES_URL}/journaalposten/{id}")
        if not response.ok:
            raise GraphQLError(f"Upstream API responded: {response.text}")
        return DeleteJournaalpost(ok=True, previous=previous)
