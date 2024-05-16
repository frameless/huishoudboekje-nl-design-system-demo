import logging
import graphene
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.postadres import Postadres
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity
from hhb_backend.graphql.utils.sort_result import sort_result


class PostadresQuery:
    return_type = graphene.Field(Postadres, id=graphene.String(required=True))

    @classmethod
    def resolver(cls, _root, info, id):
        logging.info(f"Get postadres")
        result = hhb_dataloader().postadressen.load_one(id)
        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="postadres", entityId=id)
            ]
        )
        return result


class PostadressenQuery:
    return_type = graphene.List(Postadres, ids=graphene.List(graphene.String), 
        isLogRequest=graphene.Boolean(required=False))

    @classmethod
    def resolver(cls, _root, info, ids=None, isLogRequest=False):
        logging.info(f"Get postadressen")
        if ids:
            result = sort_result(ids,  hhb_dataloader().postadressen.load(ids))
        else:
            result = hhb_dataloader().postadressen.load_all()

        AuditLogging().create(
            logRequest=isLogRequest,
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="postadres", entityId=id)
                for id in ids
            ] if ids else []
        )

        return result if not isLogRequest or isLogRequest and len(result) > 0 else None
