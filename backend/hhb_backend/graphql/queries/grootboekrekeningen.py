""" GraphQL Grootboekrekening query """
import graphene
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.grootboekrekening import Grootboekrekening
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity


class GrootboekrekeningQuery:
    return_type = graphene.Field(Grootboekrekening, id=graphene.String(required=True))

    @classmethod
    def resolver(cls, root, info, id):
        result = hhb_dataloader().grootboekrekeningen.load_one(id)
        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="grootboekrekening", entityId=id)
            ],
        )
        return result


class GrootboekrekeningenQuery:
    return_type = graphene.List(
        Grootboekrekening, ids=graphene.List(graphene.String)
    )

    @classmethod
    def resolver(cls, root, info, ids=None):
        if ids:
            result = hhb_dataloader().grootboekrekeningen.load(ids)
        else:
            result = hhb_dataloader().grootboekrekeningen.load_all()

        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="grootboekrekening", entityId=grootboekrekening["id"])
                for grootboekrekening in result
            ] if ids else []
        )

        return result
