""" GraphQL Journaalpost query """
import graphene
from flask import request

from hhb_backend.graphql.models.journaalpost import Journaalpost


class JournaalpostQuery():
    return_type = graphene.Field(Journaalpost, id=graphene.Int(required=True))

    @staticmethod
    async def resolver(root, info, **kwargs):
        return await request.dataloader.journaalposten_by_id.load(kwargs["id"])


class JournaalpostenQuery():
    return_type = graphene.List(Journaalpost, ids=graphene.List(graphene.Int, default_value=[]))

    @staticmethod
    async def resolver(root, info, **kwargs):
        if kwargs["ids"]:
            result = await request.dataloader.journaalposten_by_id.load_many(kwargs["ids"])
        else:
            result = request.dataloader.journaalposten_by_id.get_all_and_cache()
        return result
