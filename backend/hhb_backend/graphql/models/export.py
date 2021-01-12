""" Export model as used in GraphQL queries """
from datetime import datetime

import graphene
from flask import request

import hhb_backend.graphql.models.overschrijving as overschrijving


class Export(graphene.ObjectType):
    """ GraphQL Export model """
    id = graphene.Int()
    naam = graphene.String()
    timestamp = graphene.DateTime()
    overschrijvingen = graphene.List(lambda: overschrijving.Overschrijving)
    xmldata = graphene.String()
    start_datum = graphene.String()
    eind_datum = graphene.String()

    def resolve_timestamp(root, info):
        value = root.get('timestamp')
        if value:
            return datetime.fromisoformat(value)

    async def resolve_overschrijvingen(root, info):
        """ Get overschrijvingen when requested """
        if root.get('overschrijvingen'):
            return await request.dataloader.overschrijvingen_by_id.load_many(root.get('overschrijvingen')) or []
