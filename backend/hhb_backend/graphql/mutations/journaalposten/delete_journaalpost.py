import graphene
import requests
from graphql import GraphQLError

from hhb_backend.audit_logging import AuditLogging
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

    @staticmethod
    def mutate(root, info, id):
        previous = hhb_dataloader().journaalposten.load_one(id)
        if previous and previous.afspraak_id:
            previous.afspraak = hhb_dataloader().afspraken.load_one(previous.afspraak_id)

        response = requests.delete(f"{settings.HHB_SERVICES_URL}/journaalposten/{id}")
        if not response.ok:
            raise GraphQLError(f"Upstream API responded: {response.text}")

        if previous and previous.transaction_id:
            transaction = hhb_dataloader().bank_transactions.load_one(previous.transaction_id)
            update_transaction_service_is_geboekt(transaction, is_geboekt=False)

        AuditLogging.create(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="journaalpost", result=previous
            ) + gebruikers_activiteit_entities(
                entity_type="afspraak", result=previous, key="afspraak"
            ) + (
                         gebruikers_activiteit_entities(
                             entity_type="burger",
                             result=previous["afspraak"],
                             key="burger_id",
                         )
                         if "afspraak" in previous
                         else []
                     ) + gebruikers_activiteit_entities(
                entity_type="transaction", result=previous, key="transaction_id"
            ) + gebruikers_activiteit_entities(
                entity_type="grootboekrekening",
                result=previous,
                key="grootboekrekening_id",
            ),
            before=dict(journaalpost=previous),
        )

        return DeleteJournaalpost(ok=True, previous=previous)
