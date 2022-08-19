""" Export model as used in GraphQL queries """
from datetime import datetime

import graphene

import hhb_backend.graphql.models.overschrijving as overschrijving
from hhb_backend.graphql.dataloaders import hhb_dataloader


class Export(graphene.ObjectType):
    id = graphene.Int()
    naam = graphene.String()
    timestamp = graphene.DateTime()
    start_datum = graphene.String()
    eind_datum = graphene.String()
    sha256 = graphene.String()
    xmldata = graphene.String()
    overschrijvingen = graphene.List(lambda: overschrijving.Overschrijving)

    def resolve_timestamp(self, _info):
        value = self.get('timestamp')
        if value:
            return datetime.fromisoformat(value)

    async def resolve_overschrijvingen(self, _info):
        """ Get overschrijvingen when requested """
        if self.get('overschrijvingen'):
            return hhb_dataloader().overschrijvingen.load(self.get('overschrijvingen')) or []
