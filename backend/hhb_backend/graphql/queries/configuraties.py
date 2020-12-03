import graphene
from flask import request

from hhb_backend.graphql.models.configuratie import Configuratie


class ConfiguratieQuery():
    return_type = graphene.Field(Configuratie, id=graphene.String(required=True))

    @staticmethod
    async def resolver(root, info, **kwargs):
        return await request.dataloader.configuratie_by_id.load(kwargs["id"])


class ConfiguratiesQuery():
    return_type = graphene.List(Configuratie, ids=graphene.List(graphene.String, default_value=[]))

    @staticmethod
    async def resolver(root, info, **kwargs):
        if kwargs["ids"]:
            result = await request.dataloader.configuratie_by_id.load_many(kwargs["ids"])
        else:
            result = request.dataloader.configuratie_by_id.get_all_and_cache()
        return result
