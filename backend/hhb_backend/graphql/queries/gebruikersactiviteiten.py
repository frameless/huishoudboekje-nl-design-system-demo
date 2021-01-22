""" GraphQL GebruikersActiviteiten query """
import graphene
from flask import request

from hhb_backend.graphql.models.gebruikersactiviteit import GebruikersActiviteit


class GebruikersActiviteitQuery():
    return_type = graphene.Field(GebruikersActiviteit, id=graphene.Int(required=True))

    @staticmethod
    async def resolver(root, info, **kwargs):
        return await request.dataloader.gebruikersactiviteiten_by_id.load(kwargs["id"])


class GebruikersActiviteitenQuery():
    return_type = graphene.List(GebruikersActiviteit, ids=graphene.List(graphene.Int, default_value=[]), gebruikerIds=graphene.List(graphene.Int, default_value=[]))

    @staticmethod
    async def resolver(root, info, **kwargs):
        if not kwargs["ids"] and not kwargs["gebruikerIds"]:
            gebruikersactiviteiten = request.dataloader.gebruikersactiviteiten_by_id.get_all_and_cache()
        else:
            # gebruikersactiviteiten = {}
            if kwargs["ids"]:
                gebruikersactiviteiten = await request.dataloader.gebruikersactiviteiten_by_id.load_many(kwargs["ids"])
            if kwargs["gebruikerIds"]:
                gebruikersactiviteiten = request.dataloader.gebruikersactiviteiten_by_gebruikers.get_by_ids(kwargs["gebruikerIds"]) #load_many(kwargs["gebruikerIds"])

        return gebruikersactiviteiten
