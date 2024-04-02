""" GraphQL Gebruikers query """
import logging
import graphene

from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.organisatie import Organisatie
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity


class OrganisatieQuery:
    return_type = graphene.Field(Organisatie, id=graphene.Int(required=True))

    @classmethod
    def resolver(cls, root, info, id):
        logging.info(f"Get organisatie")
        AuditLogging().create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="organisatie", entityId=id)
            ]
        )
        return hhb_dataloader().organisaties.load_one(id)


class OrganisatiesQuery:
    return_type = graphene.List(
        Organisatie, ids=graphene.List(graphene.Int),
        isLogRequest=graphene.Boolean(required=False),
    )

    @classmethod
    def resolver(cls, root, info, ids=None, isLogRequest=False):
        logging.info(f"Get organisaties")
        if ids:
            result = hhb_dataloader().organisaties.load(ids)
        else:
            result = hhb_dataloader().organisaties.load_all()
        
        AuditLogging().create(
            logRequest=isLogRequest,
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="organisatie", entityId=id)
                for id in ids
            ] if ids else []
        )

        return result if not isLogRequest or isLogRequest and len(result) > 0 else None
