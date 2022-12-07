import graphene

from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.models.saldo import Saldo
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity
from hhb_backend.processen.saldo_berekenen import saldo_berekenen


class SaldoQuery:
    return_type = graphene.Field(Saldo, burger_ids=graphene.List(graphene.Int))

    @classmethod
    def resolver(cls, _root, info, burger_ids):
        result = saldo_berekenen(burger_ids)
        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="saldo", entityId=id)
                for id in burger_ids
            ]
        )
        return result
