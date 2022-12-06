import graphene

from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.models.rubriek import Rubriek
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity


class RubriekQuery:
    return_type = graphene.Field(Rubriek, id=graphene.String(required=True))

    @classmethod
    def resolver(cls, _root, info, id):
        result = hhb_dataloader().rubrieken.load_one(id)
        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="rubriek", entityId=id)
            ]
        )
        return result


class RubriekenQuery:
    return_type = graphene.List(Rubriek, ids=graphene.List(graphene.String))

    @classmethod
    def resolver(cls, _root, info, ids=None):
        if ids:
            result = hhb_dataloader().rubrieken.load(ids)
        else:
            result = hhb_dataloader().rubrieken.load_all()

        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="rubriek", entityId=id)
                for id in ids
            ] if ids else []
        )

        return result
