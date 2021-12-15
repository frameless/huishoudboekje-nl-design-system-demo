""" signaal om kenbaar te maken wanneer een alarm is afgegaan """
import graphene
from flask import request
import hhb_backend.graphql.models.Alarm as alarm

class Signal(graphene.ObjectType):
    id = graphene.String()
    alarm = graphene.Field(lambda: alarm.Alarm)
    isActive = graphene.Boolean()
    type = graphene.String()
    actions = graphene.List(graphene.String, default_value=[])
    context = graphene.String()
    timeCreated = graphene.String()

    async def resolve_alarm(root, info):
        alarm_id = root.get("alarmId")
        print(f"\n >> alarm:{root} <<\n")
        if alarm_id is not None:
            return await request.dataloader.alarmen_by_id.load(alarm_id)