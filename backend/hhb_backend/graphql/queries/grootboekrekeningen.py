""" GraphQL Grootboekrekening query """
import graphene
from flask import request

from hhb_backend.graphql.models.grootboekrekening import Grootboekrekening


class GrootboekrekeningQuery():
    return_type = graphene.Field(Grootboekrekening, id=graphene.String(required=True))

    @staticmethod
    async def resolver(root, info, **kwargs):
        return await request.dataloader.grootboekrekeningen_by_id.load(kwargs["id"])


class GrootboekrekeningenQuery():
    return_type = graphene.List(Grootboekrekening, ids=graphene.List(graphene.String, default_value=[]))

    @staticmethod
    async def resolver(root, info, **kwargs):
        if kwargs["ids"]:
            result = await request.dataloader.grootboekrekeningen_by_id.load_many(kwargs["ids"])
        else:
            result = request.dataloader.grootboekrekeningen_by_id.get_all_and_cache()
        return result
