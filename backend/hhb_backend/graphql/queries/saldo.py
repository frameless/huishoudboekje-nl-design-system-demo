import graphene

from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.models.saldo import Saldo
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
)
from hhb_backend.processen.saldo_berekenen import saldo_berekenen


class SaldoQuery:
    return_type = graphene.Field(Saldo, burger_ids=graphene.List(graphene.Int))

    @classmethod
    def resolver(cls, _root, info, burger_ids):
        result = saldo_berekenen(burger_ids)
        AuditLogging.create(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(entity_type="saldo", result=burger_ids)
        )
        return result
