""" GraphQL mutatie voor het aanmaken van een Alarm """
import graphene
from hhb_backend.graphql.models.Alarm import Alarm
from hhb_backend.graphql.scalars.bedrag import Bedrag
from hhb_backend.graphql.utils.gebruikersactiviteiten import (log_gebruikers_activiteit, gebruikers_activiteit_entities)
import requests
from graphql import GraphQLError
from hhb_backend.graphql import settings
from dateutil import parser
from datetime import date

class CreateAlarmInput(graphene.InputObjectType):
    isActive = graphene.Boolean()
    gebruikerEmail = graphene.String()
    afspraakId = graphene.Int()
    datum = graphene.String()
    datumMargin = graphene.Int()
    bedrag = graphene.Field(Bedrag)
    bedragMargin = graphene.Field(Bedrag)

class CreateAlarm(graphene.Mutation):
    class Arguments:
        input = graphene.Argument(CreateAlarmInput, required=True)

    ok = graphene.Boolean()
    alarm = graphene.Field(lambda: Alarm)

    def gebruikers_activiteit(self, _root, info, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="alarm", result=self, key="alarm"
            ),
            after=dict(alarm=self.alarm),
        )

    @staticmethod
    @log_gebruikers_activiteit
    async def mutate(_root, _info, input: CreateAlarmInput):
        """ Mutatie voor het aanmaken van een nieuw Alarm """

        alarm_date = parser.parse(input.datum).date()
        utc_now = date.today()
        if alarm_date < utc_now:
            raise GraphQLError(f"Alarm datum is in het verleden.")

        afspraak_response = requests.get(f"{settings.HHB_SERVICES_URL}/afspraken/{input.afspraakId}", headers={"Content-type": "application/json"})
        if afspraak_response.status_code != 200:
            raise GraphQLError(f"Afspraak bestaat niet.")

        create_alarm_response = requests.post(f"{settings.ALARMENSERVICE_URL}/alarms/", json=input, headers={"Content-type": "application/json"})
        if create_alarm_response.status_code != 201:
            raise GraphQLError(f"Aanmaken van het alarm is niet gelukt.")

        response_alarm = create_alarm_response.json()["data"]

        return CreateAlarm(alarm=response_alarm, ok=True)