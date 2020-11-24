""" GraphQL Rubriek query """
import graphene
from flask import request
from hhb_backend.graphql.models.rubriek import Rubriek


class RubriekQuery():
    return_type = graphene.Field(Rubriek, id=graphene.String(required=True))

    @staticmethod
    async def resolver(root, info, **kwargs):
        return await request.dataloader.rubrieken_by_id.load(kwargs["id"])

class RubriekenQuery():
    return_type = graphene.List(Rubriek, ids=graphene.List(graphene.String, default_value=[]))

    @staticmethod
    async def resolver(root, info, **kwargs):
        if kwargs["ids"]:
            rubrieken = await request.dataloader.rubrieken_by_id.load_many(kwargs["ids"])
        else:
            rubrieken = request.dataloader.rubrieken_by_id.get_all_and_cache()
        return rubrieken