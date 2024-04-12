""" Export model as used in GraphQL queries """
from datetime import datetime

import graphene

import hhb_backend.graphql.models.overschrijving as overschrijving
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.pageinfo import PageInfo
from hhb_backend.graphql.utils.dates import to_date


class Export(graphene.ObjectType):
    id = graphene.Int()
    naam = graphene.String()
    timestamp = graphene.DateTime()
    start_datum = graphene.Date()
    eind_datum = graphene.Date()
    sha256 = graphene.String()
    xmldata = graphene.String()
    verwerking_datum = graphene.Date()
    overschrijvingen = graphene.List(lambda: overschrijving.Overschrijving)

    def resolve_timestamp(self, _info):
        value = self.get('timestamp')
        if value:
            return datetime.fromisoformat(value)

    def resolve_overschrijvingen(self, _info):
        """ Get overschrijvingen when requested """
        if not self.get('overschrijvingen'):
            return hhb_dataloader().overschrijvingen.by_exports([self.get('id')]) or []

    def resolve_start_datum(self, _info):
        if value := self.get('start_datum'):
            return to_date(value)

    def resolve_eind_datum(self, _info):
        if value := self.get('eind_datum'):
            return to_date(value)

    def resolve_verwerking_datum(self, _info):
        if value := self.get('verwerking_datum'):
            return to_date(value)

class ExportsPaged(graphene.ObjectType):
    exports = graphene.List(
        Export
    )
    page_info = graphene.Field(lambda: PageInfo)