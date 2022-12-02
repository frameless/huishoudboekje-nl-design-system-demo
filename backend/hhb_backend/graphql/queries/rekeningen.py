import graphene

from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.models.rekening import Rekening
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
)


class RekeningQuery:
    return_type = graphene.Field(Rekening, id=graphene.Int(required=True))

    @classmethod
    def resolver(cls, _root, info, id):
        result = hhb_dataloader().rekeningen.load_one(id)
        AuditLogging.create(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(entity_type="rekening", result=id)
        )
        return result


class RekeningenQuery:
    return_type = graphene.List(Rekening, ids=graphene.List(graphene.Int))

    @classmethod
    def resolver(cls, _root, info, ids=None):
        if ids:
            result = hhb_dataloader().rekeningen.load(ids)
        else:
            result = hhb_dataloader().rekeningen.load_all()

        AuditLogging.create(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(entity_type="rekening", result=ids),
        )

        return result
