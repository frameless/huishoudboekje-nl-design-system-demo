import logging
import graphene

from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.models.rekening import Rekening
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity


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
    return_type = graphene.List(Rekening, ids=graphene.List(graphene.Int))

    @classmethod
    def resolver(cls, _root, info, ids=None):
        logging.info(f"Get rekeningen")
        if ids:
            result = hhb_dataloader().rekeningen.load(ids)
        else:
            result = hhb_dataloader().rekeningen.load_all()

        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="rekening", entityId=id)
                for id in ids
            ] if ids else []
        )

        return result


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
