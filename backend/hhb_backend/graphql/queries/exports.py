""" GraphQL Exports query """
import logging
import graphene

from graphql import GraphQLError
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.export import Export, ExportsPaged
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity


class ExportQuery:
    return_type = graphene.Field(Export, id=graphene.Int(required=True))

    @classmethod
    def resolver(cls, _root, info, id):
        logging.info(f"Get export")
        result = hhb_dataloader().exports.load_one(id)

        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="export", entityId=id)
            ]
        )

        return result


class ExportsQuery:
    return_type = graphene.List(
        Export,
        ids=graphene.List(graphene.Int, default_value=None),
        start_datum=graphene.Date(),
        eind_datum=graphene.Date()
    )

    @classmethod
    def resolver(cls, _root, info, ids=None, start_datum=None, eind_datum=None):
        logging.info(f"Get exports")
        if ids:
            result = hhb_dataloader().exports.load(ids)
        elif start_datum and eind_datum:
            result = hhb_dataloader().exports.in_date_range(start_datum, eind_datum)
        else:
            result = hhb_dataloader().exports.load_all()

        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(
                    entityType="export", entityId=export.id)
                for export in result
            ] if ids or (start_datum and eind_datum) else []
        )

        return result


class ExportsPagedQuery:
    return_type = graphene.Field(
        ExportsPaged,
        offset=graphene.Int(),
        limit=graphene.Int(),
    )

    @classmethod
    def resolver(cls, _root, info, offset=None, limit=None):
        logging.info(f"Get exports paged")

        if offset is None or limit is None:
            raise GraphQLError(f"offset and limit is required")

        result = hhb_dataloader().exports.custom_paged(offset, limit)

        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(
                    entityType="export", entityId=export["id"])
                for export in result.get("exports",[])
            ]
        )
        return result