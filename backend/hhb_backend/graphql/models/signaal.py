""" signaal om kenbaar te maken wanneer een alarm is afgegaan """
import graphene
from hhb_backend.graphql.models.alarm import Alarm

class Signal(graphene.ObjectType):
    
    timestamp = graphene.DateTime
    alarm = graphene.Field(Alarm)
    active = graphene.Boolean()
    actions = graphene.List(graphene.String, default_value=[])
