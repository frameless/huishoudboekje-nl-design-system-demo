""" Alarm model zoals deze gebruikt word in de GraphQL queries """
import graphene
from flask import request
import hhb_backend.graphql.models.signaal as signal
import hhb_backend.graphql.models.afspraak as afspraak
from hhb_backend.graphql.scalars.bedrag import Bedrag
from hhb_backend.graphql.scalars.day_of_week import DayOfWeek

class Alarm(graphene.ObjectType):
    """ Model om vast te stellen op basis van welke regels een signaal aangemaakt moet worden """

    id = graphene.String()
    isActive = graphene.Boolean()
    gebruikerEmail = graphene.String()
    afspraak = graphene.Field(lambda: afspraak.Afspraak)
    signaal = graphene.Field(lambda: signal.Signal)
    datum = graphene.String()
    datumMargin = graphene.Int()
    bedrag = graphene.Field(lambda: Bedrag)
    bedragMargin = graphene.Field(lambda: Bedrag)
    byDay = graphene.List(DayOfWeek, default_value=[])
    byMonth = graphene.List(graphene.Int, default_value=[])
    byMonthDay = graphene.List(graphene.Int, default_value=[])

    async def resolve_afspraak(root, info):
        return await request.dataloader.afspraken_by_id.load(root.get("afspraakId"))


