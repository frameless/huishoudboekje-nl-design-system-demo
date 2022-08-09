""" GraphQL Gebruikers query """
import graphene

from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.customer_statement_message import (
    CustomerStatementMessage,
)
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
    log_gebruikers_activiteit,
)


class CustomerStatementMessageQuery:
    return_type = graphene.Field(
        CustomerStatementMessage, id=graphene.Int(required=True)
    )

    @classmethod
    def gebruikers_activiteit(cls, _root, info, id, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="customer_statement_message", result=id
            ),
        )

    @classmethod
    @log_gebruikers_activiteit
    async def resolver(cls, _root, _info, id):
        return hhb_dataloader().csms_by_id.load(id)


class CustomerStatementMessagesQuery:
    return_type = graphene.List(
        CustomerStatementMessage, ids=graphene.List(graphene.Int, default_value=[])
    )

    @classmethod
    def gebruikers_activiteit(cls, _root, info, ids, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="customer_statement_message", result=ids
            ),
        )

    @classmethod
    @log_gebruikers_activiteit
    async def resolver(cls, _root, _info, ids=None):
        if ids:
            return hhb_dataloader().csms_by_id.load_many(ids)
        return hhb_dataloader().csms_by_id.load_all()
