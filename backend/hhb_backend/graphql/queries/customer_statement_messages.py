""" GraphQL Gebruikers query """
import graphene

from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.customer_statement_message import (
    CustomerStatementMessage,
)
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
)


class CustomerStatementMessageQuery:
    return_type = graphene.Field(
        CustomerStatementMessage, id=graphene.Int(required=True)
    )

    @classmethod
    def resolver(cls, _root, info, id):
        result = hhb_dataloader().csms.load_one(id)

        AuditLogging.create(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="customer_statement_message", result=id
            ),
        )

        return result


class CustomerStatementMessagesQuery:
    return_type = graphene.List(
        CustomerStatementMessage, ids=graphene.List(graphene.Int)
    )

    @classmethod
    def resolver(cls, _root, info, ids=None):
        if ids:
            result = hhb_dataloader().csms.load(ids)
        else:
            result = hhb_dataloader().csms.load_all()

        AuditLogging.create(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="customer_statement_message", result=ids
            ),
        )

        return result
