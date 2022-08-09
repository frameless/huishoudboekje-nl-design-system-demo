""" GraphQL Exports query """
import graphene
from graphql import GraphQLError

from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.export import Export
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
    log_gebruikers_activiteit,
)


class ExportQuery:
    return_type = graphene.Field(Export, id=graphene.Int(required=True))

    @classmethod
    def gebruikers_activiteit(cls, _root, info, id, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="configuratie", result=id
            ),
        )

    @classmethod
    @log_gebruikers_activiteit
    async def resolver(cls, _root, _info, id):
        return hhb_dataloader().export_by_id.load(id)


class ExportsQuery:
    return_type = graphene.List(
        Export,
        ids=graphene.List(graphene.Int, default_value=None),
        start_datum=graphene.Date(),
        eind_datum=graphene.Date(),
    )

    @classmethod
    def gebruikers_activiteit(cls, _root, info, *_args, **kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="configuratie",
                result=kwargs["result"] if "result" in kwargs else None,
            ),
        )

    @classmethod
    @log_gebruikers_activiteit
    async def resolver(cls, _root, _info, ids=None, start_datum=None, eind_datum=None):
        if ids:
            return hhb_dataloader().export_by_id.load_many(ids)
        if start_datum or eind_datum:
            if not (start_datum and eind_datum):
                raise GraphQLError("start_datum must be combined with eind_datum")
        if not (start_datum and eind_datum):
            return hhb_dataloader().export_by_id.load_all()
        return hhb_dataloader().export_by_id.get_by_timestamps(start_datum, eind_datum)
