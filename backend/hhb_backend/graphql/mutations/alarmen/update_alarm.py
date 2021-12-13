""" GraphQl Mutatie voor het aanpassen van een Alarm """
import graphene
from hhb_backend.graphql.models.Alarm import Alarm
from hhb_backend.graphql.scalars.bedrag import Bedrag
from hhb_backend.graphql.utils.gebruikersactiviteiten import (gebruikers_activiteit_entities, log_gebruikers_activiteit)
import requests
from flask import request
from hhb_backend.graphql import settings
from graphql import GraphQLError
from dateutil import parser
from datetime import date

class UpdateAlarmInput(graphene.InputObjectType):
    isActive = graphene.Boolean()
    gebruikerEmail = graphene.String()
    afspraakId = graphene.Int()
    datum = graphene.String()
    datumMargin = graphene.Int()
    bedrag = graphene.Field(Bedrag)
    bedragMargin = graphene.Field(Bedrag)

class UpdateAlarm(graphene.Mutation):
    class Arguments:
        id = graphene.String(required=True)
        input = graphene.Argument(UpdateAlarmInput, required=True)

    ok = graphene.Boolean()
    alarm = graphene.Field(lambda: Alarm)
    previous = graphene.Field(lambda: Alarm)

    def gebruikers_activiteit(self, _root, info, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="alarm", result=self, key="alarm"
            ),
            before=dict(alarm=self.previous),
            after=dict(alarm=self.alarm),
        )

    @staticmethod
    @log_gebruikers_activiteit
    async def mutate(_root, _info, id: str, input: UpdateAlarmInput):
        """ Mutatie voor het wijzigen van een bestaand Alarm """

        alarm_date = parser.parse(input.datum).date()
        utc_now = date.today()
        if alarm_date < utc_now:
            raise GraphQLError(f"Alarm datum is in het verleden.")

        # previous = request.dataloader.alarmen_by_id.load(id) # stalls and waits forever if alarm does not exist
        previous_response = requests.get(f"{settings.ALARMENSERVICE_URL}/alarms/{id}", headers={"Content-type": "application/json"})
        if previous_response.status_code != 200:
            raise GraphQLError(f"Alarm bestaat niet.")

        previous = previous_response.json()

        afspraak_response = requests.get(f"{settings.HHB_SERVICES_URL}/afspraken/{input.afspraakId}", headers={"Content-type": "application/json"})
        if afspraak_response.status_code != 200:
            raise GraphQLError(f"Afspraak bestaat niet.")

        response = requests.put(f"{settings.ALARMENSERVICE_URL}/alarms/{id}", json=input, headers={"Content-type": "application/json"})
        if response.status_code != 200:
            raise GraphQLError(f"Upstream API responded: {response.json()}")
        response_alarm = response.json()['data']

        return UpdateAlarm(alarm=response_alarm, previous=previous, ok=True)