""" GebruikersActiviteit model as used in GraphQL queries """
from datetime import date, datetime

import graphene
from flask import request
import hhb_backend.graphql.models.gebruiker as gebruiker


class GebruikersActiviteit(graphene.ObjectType):
    """GebruikersActiviteit model"""
    id = graphene.Int()
    timestamp = graphene.DateTime()
    gebruiker = graphene.Int()
    action = graphene.String()
    entities = graphene.String()
    snapshot_before = graphene.String()
    snapshot_after = graphene.String()
    meta = graphene.String()

    def resolve_timestamp(root, info):
        value = root.get('timestamp')
        if value:
            return datetime.fromisoformat(value)

    # async def resolve_gebruiker(root, info):
    #     # TODO medewerker?
    #     if root.get('gebruiker_id'):
    #         return await request.dataloader.gebruikers_by_id.load(root.get('gebruiker_id'))


