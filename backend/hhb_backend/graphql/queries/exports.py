""" GraphQL Exports query """
import graphene
from flask import request
from graphql import GraphQLError

from hhb_backend.graphql.models.export import Export


class ExportQuery():
    return_type = graphene.Field(Export, id=graphene.Int(required=True))

    @staticmethod
    async def resolver(root, info, **kwargs):
        return await request.dataloader.exports_by_id.load(kwargs["id"])


class ExportsQuery():
    return_type = graphene.List(Export, ids=graphene.List(graphene.Int, default_value=None),
                                start_datum=graphene.Date(), eind_datum=graphene.Date())

    @staticmethod
    async def resolver(root, info, ids=None, start_datum=None, eind_datum=None, **kwargs):
        if ids:
            return await request.dataloader.exports_by_id.load_many(ids)
        if start_datum or eind_datum:
            if not (start_datum and eind_datum):
                raise GraphQLError("start_datum must be combined with eind_datum")
        return request.dataloader.exports_by_id.get_by_timestamps(start_datum, eind_datum)
