
import graphene
import requests
from flask import request
from dateutil import parser
from datetime import date
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.utils.gebruikersactiviteiten import (log_gebruikers_activiteit, gebruikers_activiteit_entities)
from hhb_backend.graphql.scalars.day_of_week import DayOfWeek
from hhb_backend.graphql.scalars.bedrag import Bedrag

class CreateAlarmInput(graphene.InputObjectType):
    isActive = graphene.Boolean()
    gebruikerEmail = graphene.String()
    afspraakId = graphene.Int()
    datum = graphene.String()
    datumMargin = graphene.Int()
    bedrag = graphene.Field(Bedrag)
    bedragMargin = graphene.Field(Bedrag)
    byDay = graphene.List(DayOfWeek, default_value=[])
    byMonth = graphene.List(graphene.Int, default_value=[])
    byMonthDay = graphene.List(graphene.Int, default_value=[])

class UpdateAlarmInput(graphene.InputObjectType):
    isActive = graphene.Boolean()
    gebruikerEmail = graphene.String()
    afspraakId = graphene.Int()
    datum = graphene.String()
    datumMargin = graphene.Int()
    bedrag = graphene.Field(Bedrag)
    bedragMargin = graphene.Field(Bedrag)
    byDay = graphene.List(DayOfWeek)
    byMonth = graphene.List(graphene.Int)
    byMonthDay = graphene.List(graphene.Int)


class AlarmHelper:

    def __init__(self, alarm, previous, ok) -> None:
        self.alarm = alarm
        self.previous = previous
        self.ok = ok

    def gebruikers_activiteit(self, _root, info, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="alarm", result=self, key="alarm"
            ),
            before=dict(alarm=self.previous),
            after=dict(alarm=self.alarm),
        )

    @log_gebruikers_activiteit
    async def create(_root, _info, input: CreateAlarmInput):
        # alarm_date = parser.parse(input.datum).date()
        # utc_now = date.today()
        # if alarm_date < utc_now:
        #     raise GraphQLError(f"De alarmdatum moet in de toekomst liggen.")

        if ((input["byMonth"] is not None and input["byMonthDay"] is None) or (input["byMonth"] is None and input["byMonthDay"] is not None)) or (
            (len(input["byMonth"]) >= 1 and len(input["byMonthDay"]) <= 0) or (len(input["byMonth"]) <= 0 and len(input["byMonthDay"]) >= 1)):
            raise GraphQLError(f"Vul zowel byMonth als byMonthDay in, of geen van beide.")

        afspraakId = input["afspraakId"]
        afspraak_response = requests.get(f"{settings.HHB_SERVICES_URL}/afspraken/{afspraakId}", headers={"Content-type": "application/json"})
        if afspraak_response.status_code != 200:
            raise GraphQLError(f"Afspraak bestaat niet.")
        afspraak = afspraak_response.json()["data"]

        create_alarm_response = requests.post(f"{settings.ALARMENSERVICE_URL}/alarms/", json=input, headers={"Content-type": "application/json"})
        if create_alarm_response.status_code != 201:
            raise GraphQLError(f"Aanmaken van het alarm is niet gelukt.")
        response_alarm = create_alarm_response.json()["data"]

        afspraak.update({"alarm_id": response_alarm.get("id")})
        update_afspraak_response = requests.post(f"{settings.HHB_SERVICES_URL}/afspraken/{afspraakId}", json=afspraak, headers={"Content-type": "application/json"})
        if update_afspraak_response.status_code != 200:
            raise GraphQLError(f"Updaten van afspraak met het nieuwe alarm is niet gelukt. Error message: {update_afspraak_response.json}")

        return AlarmHelper(alarm=response_alarm, previous=dict(), ok=True)

    @log_gebruikers_activiteit
    async def delete(_root, _info, id):
        previous = await request.dataloader.alarmen_by_id.load(id)
        if not previous:
            raise GraphQLError(f"Alarm with id {id} not found")

        response = requests.delete(f"{settings.ALARMENSERVICE_URL}/alarms/{id}")
        if response.status_code != 204:
            raise GraphQLError(f"Upstream API responded: {response.json()}")

        return AlarmHelper(alarm=dict(), previous=previous, ok=True)


    @log_gebruikers_activiteit
    async def update(_root, _info, id: str, input: UpdateAlarmInput):
        if input.datum:
            alarm_date = parser.parse(input.datum).date()
            utc_now = date.today()
            if alarm_date < utc_now:
                raise GraphQLError(f"Alarm datum is in het verleden.")

        # previous = request.dataloader.alarmen_by_id.load(id) # stalls and waits forever if alarm does not exist
        previous_response = requests.get(f"{settings.ALARMENSERVICE_URL}/alarms/{id}", headers={"Content-type": "application/json"}) 
        if previous_response.status_code != 200:
            raise GraphQLError(f"Alarm bestaat niet.")

        previous = previous_response.json()

        if input.afspraakId:
            afspraak_response = requests.get(f"{settings.HHB_SERVICES_URL}/afspraken/{input.afspraakId}", headers={"Content-type": "application/json"})
            if afspraak_response.status_code != 200:
                raise GraphQLError(f"Afspraak bestaat niet.")

        response = requests.put(f"{settings.ALARMENSERVICE_URL}/alarms/{id}", json=input, headers={"Content-type": "application/json"}) 
        if response.status_code != 200:
            raise GraphQLError(f"Upstream API responded: {response.json()}")
        response_alarm = response.json()['data']

        return AlarmHelper(alarm=response_alarm, previous=previous, ok=True)
