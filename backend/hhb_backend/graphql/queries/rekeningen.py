import logging
import graphene

from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.models.rekening import Rekening
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity
from hhb_backend.graphql.utils.sort_result import sort_result


class RekeningQuery:
    return_type = graphene.Field(Rekening, id=graphene.Int(required=True))

    @classmethod
    def resolver(cls, _root, info, id):
        logging.info(f"Get rekening")
        result = hhb_dataloader().rekeningen.load_one(id)
        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="rekening", entityId=id)
            ]
        )
        return result


class RekeningenQuery:
    return_type = graphene.List(Rekening, ids=graphene.List(graphene.Int),
        isLogRequest=graphene.Boolean(required=False))

    @classmethod
    def resolver(cls, _root, info, ids=None, isLogRequest=False):
        logging.info(f"Get rekeningen")
        if ids:
            result = sort_result(ids,  hhb_dataloader().rekeningen.load(ids))
        else:
            result = hhb_dataloader().rekeningen.load_all()
        
        AuditLogging().create(
            logRequest=isLogRequest,
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="rekening", entityId=id)
                for id in ids
            ] if ids else []
        )

        return result if not isLogRequest or isLogRequest and len(result) > 0 else None


class RekeningenByIbansQuery:
    return_type = graphene.List(Rekening, ibans=graphene.List(graphene.String))

    @classmethod
    def resolver(cls, _root, info, ibans=None):
        logging.info(f"Get rekeningen by iban")
        if ibans:
            result = hhb_dataloader().rekeningen.by_ibans(ibans)
        else:
            result = []

        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(
                    entityType="rekening", entityId=item.id)
                for item in result
            ] if ibans else []
        )

        return result
