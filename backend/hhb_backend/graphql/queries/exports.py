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
                                begin_timestamp=graphene.Date(), eind_timestamp=graphene.Date())

    @staticmethod
    async def resolver(root, info, ids=None, begin_timestamp=None, eind_timestamp=None, **kwargs):
        if ids:
            return await request.dataloader.exports_by_id.load_many(ids)
        if begin_timestamp or eind_timestamp:
            if not (begin_timestamp and eind_timestamp):
                raise GraphQLError("begin_timestamp must be combined with eind_timestamp")
        return request.dataloader.exports_by_id.get_by_timestamps(begin_timestamp, eind_timestamp)
