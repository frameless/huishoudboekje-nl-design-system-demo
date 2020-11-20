""" GraphQL Gebruikers query """
import graphene
from flask import request

from hhb_backend.graphql.models.afspraak import Afspraak


class AfspraakQuery():
    return_type = graphene.Field(Afspraak, id=graphene.Int(required=True))

    @staticmethod
    async def resolver(root, info, **kwargs):
        return await request.dataloader.afspraken_by_id.load(kwargs["id"])

class AfsprakenQuery():
    return_type = graphene.List(Afspraak, ids=graphene.List(graphene.Int, default_value=[]))

    @staticmethod
    async def resolver(root, info, **kwargs):
        if kwargs["ids"]:
            afspraken = await request.dataloader.afspraken_by_id.load_many(kwargs["ids"])
        else:
            afspraken = request.dataloader.afspraken_by_id.get_all_and_cache()
        return afspraken
