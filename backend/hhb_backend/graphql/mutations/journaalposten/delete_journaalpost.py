import graphene
import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
import hhb_backend.graphql.models.journaalpost as graphene_journaalpost
from hhb_backend.graphql.mutations.journaalposten import update_transaction_service_is_geboekt
from hhb_backend.graphql.utils.gebruikersactiviteiten import (gebruikers_activiteit_entities, log_gebruikers_activiteit)


class DeleteJournaalpost(graphene.Mutation):

    class Arguments:
        id = graphene.Int(required=True)

    ok = graphene.Boolean()
    previous = graphene.Field(lambda: graphene_journaalpost.Journaalpost)

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
                    key="burger_id",
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
    def mutate(_root, _info, id):
        previous = hhb_dataloader().journaalposten.load_one(id)
        if previous and previous.afspraak_id:
            previous.afspraak = hhb_dataloader().afspraken.load_one(previous.afspraak_id)

        response = requests.delete(f"{settings.HHB_SERVICES_URL}/journaalposten/{id}")
        if not response.ok:
            raise GraphQLError(f"Upstream API responded: {response.text}")

        if previous and previous.transaction_id:
            transaction = hhb_dataloader().bank_transactions.load_one(previous.transaction_id)
            update_transaction_service_is_geboekt(transaction, is_geboekt=False)

        return DeleteJournaalpost(ok=True, previous=previous)
