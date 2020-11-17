""" GraphQL Gebruikers query """
import graphene
from flask import request

import hhb_backend.graphql.models.gebruiker as gebruiker


class GebruikerQuery():
    return_type = graphene.Field(gebruiker.Gebruiker, id=graphene.Int(required=True))

    @staticmethod
    async def resolver(root, info, **kwargs):
        return await request.dataloader.gebruikers_by_id.load(kwargs["id"])


class GebruikersQuery():
    return_type = graphene.List(gebruiker.Gebruiker, ids=graphene.List(graphene.Int, default_value=[]))

    @staticmethod
    async def resolver(root, info, **kwargs):
        if kwargs["ids"]:
            gebruikers = await request.dataloader.gebruikers_by_id.load_many(kwargs["ids"])
        else:
            gebruikers = request.dataloader.gebruikers_by_id.get_all_and_cache()
        return gebruikers
