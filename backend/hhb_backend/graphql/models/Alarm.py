""" Alarm model zoals deze gebruikt word in de GraphQL queries """
import graphene

import hhb_backend.graphql.models.afspraak as afspraak
import hhb_backend.graphql.models.signaal as signaal
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.scalars.bedrag import Bedrag
from hhb_backend.graphql.scalars.day_of_week import DayOfWeek


class Alarm(graphene.ObjectType):
    """ Model om vast te stellen op basis van welke regels een signaal aangemaakt moet worden """

    id = graphene.String()
    isActive = graphene.Boolean()
    afspraak = graphene.Field(lambda: afspraak.Afspraak)
    signaal = graphene.Field(lambda: signaal.Signaal)
    startDate = graphene.String()
    endDate = graphene.String()
    datumMargin = graphene.Int()
    bedrag = graphene.Field(lambda: Bedrag)
    bedragMargin = graphene.Field(lambda: Bedrag)
    byDay = graphene.List(DayOfWeek, default_value=[])
    byMonth = graphene.List(graphene.Int, default_value=[])
    byMonthDay = graphene.List(graphene.Int, default_value=[])

    async def resolve_afspraak(self, _info):
        return hhb_dataloader().afspraak_by_id.load(self.get("afspraakId"))

    async def resolve_signaal(self, _info):
        if self.get("signaalId"):
            return hhb_dataloader().signalen_by_id.load(self.get("signaalId"))
