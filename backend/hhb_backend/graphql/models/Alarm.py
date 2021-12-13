""" Alarm model zoals deze gebruikt word in de GraphQL queries """
import graphene
from flask import request
from hhb_backend.graphql.scalars.bedrag import Bedrag
from hhb_backend.graphql.models.afspraak import Afspraak


class Alarm(graphene.ObjectType):
    """ Model om vast te stellen op basis van welke regels een signaal aangemaakt moet worden """

    id = graphene.String()
    isActive = graphene.Boolean()
    gebruikerEmail = graphene.String()
    afspraak = graphene.Field(Afspraak)
    datum = graphene.String()
    datumMargin = graphene.Int()
    bedrag = graphene.Field(Bedrag)
    bedragMargin = graphene.Field(Bedrag)

    async def resolve_afspraak(root, info):
        return await request.dataloader.afspraken_by_id.load(root.get("afspraakId"))


