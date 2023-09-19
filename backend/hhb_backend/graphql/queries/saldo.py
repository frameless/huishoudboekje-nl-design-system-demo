from hhb_backend.graphql.dataloaders import hhb_dataloader
import graphene

from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.models.saldo import Saldo


class SaldoQuery:
    return_type = graphene.Field(Saldo, burger_ids=graphene.List(
        graphene.Int), date=graphene.String())

    @classmethod
    def resolver(cls, _root, info, burger_ids, date):
        result = hhb_dataloader().saldo.get_saldo(burger_ids, date)
        AuditLogging.create(
            action=info.field_name,
            entities=[]
        )
        return result
