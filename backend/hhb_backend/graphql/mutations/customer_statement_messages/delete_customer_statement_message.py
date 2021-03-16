""" GraphQL mutation for deleting a Organisatie """
import os
import graphene
import requests
from graphql import GraphQLError
from hhb_backend.graphql import settings, dataloaders
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.customer_statement_message import (
    CustomerStatementMessage,
)
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
    log_gebruikers_activiteit,
)


class DeleteCustomerStatementMessage(graphene.Mutation):
    class Arguments:
        # organisatie arguments
        id = graphene.Int(required=True)

    ok = graphene.Boolean()
    previous = graphene.Field(lambda: CustomerStatementMessage)

    def gebruikers_activiteit(self, _root, info, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="customerStatementMessage", result=self, key="previous"
            ),
            before=dict(customerStatementMessage=self.previous),
        )

    @staticmethod
    @log_gebruikers_activiteit
    async def mutate(_root, _info, id):
        """ Delete current Customer Statement Message """
        previous = await hhb_dataloader().csms_by_id.load(id)

        transactions = await dataloaders.hhb_dataloader().bank_transactions_by_csm.load(id)

        transaction_ids = [t["id"] for t in transactions]

        journaalposten = await hhb_dataloader().journaalposten_by_transaction.load_many(
            transaction_ids
        )

        for journaalpost in journaalposten:
            if journaalpost is not None:
                response = requests.delete(f"{settings.HHB_SERVICES_URL}/journaalposten/{journaalpost['id']}")
                if not response.ok:
                    raise GraphQLError(f"Upstream API responded: {response.text}")

        for transaction in transactions:
            response = requests.delete(f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/{transaction['id']}")
            if not response.ok:
                raise GraphQLError(f"Upstream API responded: {response.text}")

        delete_response_hhb = requests.delete(
            f"{settings.TRANSACTIE_SERVICES_URL}/customerstatementmessages/{id}"
        )
        if delete_response_hhb.status_code != 204:
            raise GraphQLError(f"Upstream API responded: {delete_response_hhb.text}")

        return DeleteCustomerStatementMessage(ok=True, previous=previous)
