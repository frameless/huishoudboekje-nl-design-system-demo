import logging
import graphene

from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.signaal import Signaal
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity


class SignaalQuery:
    return_type = graphene.Field(Signaal, id=graphene.String(required=True))

    @classmethod
    def resolver(cls, _root, info, id):
        logging.info(f"Get signaal")
        AuditLogging().create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="signaal", entityId=id)
            ]
        )
        return hhb_dataloader().signalen.load_one(id)


class SignalenQuery:
    return_type = graphene.List(Signaal, ids=graphene.List(graphene.String))

    @classmethod
    def resolver(cls, _root, info, ids=None):
        logging.info(f"Get signalen")
        if ids:
            result = hhb_dataloader().signalen.load(ids)
        else:
            result = hhb_dataloader().signalen.load_all()

        AuditLogging().create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="signaal", entityId=id)
                for id in ids
            ] if ids else []
        )

        return result
