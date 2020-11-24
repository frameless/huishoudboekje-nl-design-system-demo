""" GraphQL Rekeningen query """
import graphene
from flask import request

from hhb_backend.graphql.models.rekening import Rekening


class RekeningQuery():
    return_type = graphene.Field(Rekening, id=graphene.Int(required=True))

    @staticmethod
    async def resolver(root, info, **kwargs):
        return await request.dataloader.rekeningen_by_id.load(kwargs["id"])

class RekeningenQuery():
    return_type = graphene.List(Rekening, ids=graphene.List(graphene.Int, default_value=[]))

    @staticmethod
    async def resolver(root, info, **kwargs):
        if kwargs["ids"]:
            rekeningen = await request.dataloader.rekeningen_by_id.load_many(kwargs["ids"])
        else:
            rekeningen = request.dataloader.rekeningen_by_id.get_all_and_cache()
        return rekeningen