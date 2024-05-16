""" GraphQL Gebruikers query """
import logging
import graphene

from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.afdeling import Afdeling
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity
from hhb_backend.graphql.utils.sort_result import sort_result


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
    return_type = graphene.List(Afdeling, ids=graphene.List(graphene.Int), isLogRequest=graphene.Boolean(required=False))

    @classmethod
    def resolver(cls, _, info, ids=None, isLogRequest=False):
        logging.info(f"Get afdelingen")
        if ids:
            result = sort_result(ids, hhb_dataloader().afdelingen.load(ids))
        else:
            result = hhb_dataloader().afdelingen.load_all()

        AuditLogging.create(
            logRequest=isLogRequest,
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="afdeling", entityId=id)
                for id in ids
            ] if ids else []
        )
        return result if not isLogRequest or isLogRequest and len(result) > 0 else None

class AfdelingenByIbanQuery:
    return_type = graphene.List(
        Afdeling, iban=graphene.String()
    )

    @classmethod
    def resolver(cls, root, info, iban=None):
        logging.info(f"Get organisaties by iban")

        if iban is None:
            return []


        rekeningen = hhb_dataloader().rekeningen.by_ibans([iban])
        rekening_ids = [rekening.id if rekening is not None else -1 for rekening in rekeningen]
        result = hhb_dataloader().afdelingen.by_rekeningen(rekening_ids)

        AuditLogging().create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="afdeling", entityId=afdeling.id)
                for afdeling in result
            ] if result else []
        )

        return result