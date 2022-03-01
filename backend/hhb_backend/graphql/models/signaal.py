""" Signaal om kenbaar te maken wanneer een alarm is afgegaan """
import graphene
from flask import request
import hhb_backend.graphql.models.Alarm as alarm

class Signaal(graphene.ObjectType):
    id = graphene.String()
    alarm = graphene.Field(lambda: alarm.Alarm)
    isActive = graphene.Boolean()
    type = graphene.String()
    actions = graphene.List(graphene.String, default_value=[])
    context = graphene.String()
    timeUpdated = graphene.String()

    async def resolve_alarm(root, info):
        alarm_id = root.get("alarmId")
        if alarm_id is not None:
            return await request.dataloader.alarmen_by_id.load(alarm_id)