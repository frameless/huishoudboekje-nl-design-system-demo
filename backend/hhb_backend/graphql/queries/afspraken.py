""" GraphQL Afspraken query """
import graphene

import hhb_backend.graphql.models.afspraak as afspraak
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity


class AfspraakQuery:
    return_type = graphene.Field(afspraak.Afspraak, id=graphene.Int(required=True))

    @classmethod
    def resolver(cls, _, info, id):
        AuditLogging.create(
            action=info.field_name,
            entities=(GebruikersActiviteitEntity(entityType="afspraak", entityId=id))
        )
        return hhb_dataloader().afspraken.load_one(id)


class AfsprakenQuery:
    return_type = graphene.List(afspraak.Afspraak, ids=graphene.List(graphene.Int))

    @classmethod
    def resolver(cls, _, info, ids=None):
        if ids:
            result = hhb_dataloader().afspraken.load(ids)
        else:
            result = hhb_dataloader().afspraken.load_all()

        AuditLogging.create(
            action=info.field_name, 
            entities=[
                GebruikersActiviteitEntity(entityType="afspraak", entityId=id)
                for id in ids
            ] if ids else []
        )
        return result
