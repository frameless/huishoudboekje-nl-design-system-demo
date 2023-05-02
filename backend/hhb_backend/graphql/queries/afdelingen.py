""" GraphQL Gebruikers query """
import logging
import graphene

from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.afdeling import Afdeling
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity


class AfdelingQuery:
    return_type = graphene.Field(Afdeling, id=graphene.Int(required=True))

    @classmethod
    def resolver(cls, _, info, id):
        logging.info(f"Get afdeling")
        result = hhb_dataloader().afdelingen.load_one(id)
        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="afdeling", entityId=id)
            ]
        )
        return result


class AfdelingenQuery:
    return_type = graphene.List(Afdeling, ids=graphene.List(graphene.Int))

    @classmethod
    def resolver(cls, _, info, ids=None):
        logging.info(f"Get afdelingen")
        if ids:
            result = hhb_dataloader().afdelingen.load(ids)
        else:
            result = hhb_dataloader().afdelingen.load_all()

        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="afdeling", entityId=id)
                for id in ids
            ] if ids else []
        )
        return result
