import graphene
import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.journaalpost import Journaalpost
from hhb_backend.graphql.mutations.journaalposten import update_transaction_is_geboekt
from hhb_backend.graphql.utils.gebruikersactiviteiten import (gebruikers_activiteit_entities, log_gebruikers_activiteit)


class DeleteJournaalpost(graphene.Mutation):
    """ Delete journaalpost by id """

    class Arguments:
        id = graphene.Int(required=True)

    ok = graphene.Boolean()
    previous = graphene.Field(lambda: Journaalpost)

    def gebruikers_activiteit(self, _root, info, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="journaalpost", result=self, key="previous"
            )
            + gebruikers_activiteit_entities(
                entity_type="afspraak", result=self.previous, key="afspraak"
            )
            + (
                gebruikers_activiteit_entities(
                    entity_type="burger",
                    result=self.previous["afspraak"],
                    key="gebruiker_id",
                )
                if "afspraak" in self.previous
                else []
            )
            + gebruikers_activiteit_entities(
                entity_type="transaction", result=self.previous, key="transaction_id"
            )
            + gebruikers_activiteit_entities(
                entity_type="grootboekrekening",
                result=self.previous,
                key="grootboekrekening_id",
            ),
            before=dict(journaalpost=self.previous),
        )

    @staticmethod
    @log_gebruikers_activiteit
    async def mutate(_root, info, id):
        previous = await hhb_dataloader().journaalposten_by_id.load(id)
        if previous and "afspraak_id" in previous:
            previous["afspraak"] = await hhb_dataloader().afspraken_by_id.load(
                previous["afspraak_id"]
            )

        response = requests.delete(f"{settings.HHB_SERVICES_URL}/journaalposten/{id}")
        if not response.ok:
            raise GraphQLError(f"Upstream API responded: {response.text}")

        transaction = await hhb_dataloader().bank_transactions_by_id.load(previous['transaction_id'])
        update_transaction_is_geboekt(transaction, is_geboekt=False)

        return DeleteJournaalpost(ok=True, previous=previous)
