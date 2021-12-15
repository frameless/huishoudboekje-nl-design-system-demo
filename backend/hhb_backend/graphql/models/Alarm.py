""" Alarm model zoals deze gebruikt word in de GraphQL queries """
import graphene
from flask import request
import hhb_backend.graphql.models.signaal as signal
import hhb_backend.graphql.models.afspraak as afspraak
from hhb_backend.graphql.scalars.bedrag import Bedrag



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

    async def resolve_afspraak(root, info):
        return await request.dataloader.afspraken_by_id.load(root.get("afspraakId"))


