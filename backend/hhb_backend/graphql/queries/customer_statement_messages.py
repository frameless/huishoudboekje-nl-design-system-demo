""" GraphQL Gebruikers query """
import logging
import graphene

from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.customer_statement_message import (
    CustomerStatementMessage,
)
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity


class CustomerStatementMessageQuery:
    return_type = graphene.Field(
        CustomerStatementMessage, id=graphene.Int(required=True)
    )

    @classmethod
    def resolver(cls, _root, info, id):
        logging.info(f"Get customer statement message")
        result = hhb_dataloader().csms.load_one(id)

        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="customer_statement_message", entityId=id)
            ],
        )

        return result


class CustomerStatementMessagesQuery:
    return_type = graphene.List(
        CustomerStatementMessage, ids=graphene.List(graphene.Int),isLogRequest=graphene.Boolean(required=False)
    )

    @classmethod
    def resolver(cls, _root, info, ids=None, isLogRequest=False):
        logging.info(f"Get customer statement messages")
        if ids:
            result = hhb_dataloader().csms.load(ids)
        else:
            result = hhb_dataloader().csms.load_all()

        AuditLogging().create(
            logRequest=isLogRequest,
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="customer_statement_message", entityId=csm["id"])
                for csm in result
            ] if ids else []
        )

        return result if not isLogRequest or isLogRequest and len(result) > 0 else None
