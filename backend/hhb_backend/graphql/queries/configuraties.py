import logging
import graphene

from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.configuratie import Configuratie
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity


class ConfiguratieQuery:
    return_type = graphene.Field(Configuratie, id=graphene.String(required=True))

    @classmethod
    def resolver(cls, _, info, id):
        logging.info(f"Get configuratie")
        result = hhb_dataloader().configuraties.load_one(id)
        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="configuratie", entityId=id)
            ],
        )
        return result


class ConfiguratiesQuery:
    return_type = graphene.List(
        Configuratie, ids=graphene.List(graphene.String), 
        isLogRequest=graphene.Boolean(required=False)
    )

    @classmethod
    def resolver(cls, _root, info, ids=None, isLogRequest=False):
        logging.info(f"Get configuraties")
        result = []
        if ids:
            result = hhb_dataloader().configuraties.load(ids)
        else:
            result = hhb_dataloader().configuraties.load_all()

        AuditLogging().create(
            logRequest=isLogRequest,
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="configuratie", entityId=config["id"])
                for config in result
            ] if ids else []
        )

        return result if not isLogRequest or isLogRequest and len(result) > 0 else None
