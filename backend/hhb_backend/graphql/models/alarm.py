""" Alarm model zoals deze gebruikt word in de GraphQL queries """
import graphene

import hhb_backend.graphql.models.afspraak as afspraak
import hhb_backend.graphql.models.signaal as signaal
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.scalars.bedrag import Bedrag
from hhb_backend.graphql.scalars.day_of_week import DayOfWeekEnum


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
    byDay = graphene.List(DayOfWeekEnum)
    byMonth = graphene.List(graphene.Int)
    byMonthDay = graphene.List(graphene.Int)

    def resolve_afspraak(self, _info):
        return hhb_dataloader().afspraken.load_one(self.get("afspraakId"))

    def resolve_signaal(self, _info):
        if self.get("signaalId"):
            return hhb_dataloader().signalen.load_one(self.get("signaalId"))
