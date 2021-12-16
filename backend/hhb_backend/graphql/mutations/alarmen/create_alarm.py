""" GraphQL mutatie voor het aanmaken van een Alarm """
from hhb_backend import graphql
import graphene
from hhb_backend.graphql.models.Alarm import Alarm
from hhb_backend.graphql.scalars.bedrag import Bedrag
from hhb_backend.graphql.utils.gebruikersactiviteiten import (log_gebruikers_activiteit, gebruikers_activiteit_entities)
import requests
from graphql import GraphQLError
from hhb_backend.graphql import settings
from dateutil import parser
from datetime import date
from hhb_backend.graphql.scalars.day_of_week import DayOfWeek

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

        if (input.byDay is None and input.byMonth is None and input.byMonthDay is None) or (
            len(input.byDay) <= 0 and len(input.byMonth) <=0 and len(input.byMonthDay) <= 0):
            raise GraphQLError(f"Voor het aanmaken van het alarm is byDay of ByMonth en byMonthDay verplicht.")

        afspraak_response = requests.get(f"{settings.HHB_SERVICES_URL}/afspraken/{input.afspraakId}", headers={"Content-type": "application/json"})
        if afspraak_response.status_code != 200:
            raise GraphQLError(f"Afspraak bestaat niet.")
        afspraak = afspraak_response.json()["data"]

        if afspraak.get("credit") != False:
            raise GraphQLError(f"Alarm is enkel mogelijk voor uitgaven.")
            # vanwege de betaalinstructie

        create_alarm_response = requests.post(f"{settings.ALARMENSERVICE_URL}/alarms/", json=input, headers={"Content-type": "application/json"})
        if create_alarm_response.status_code != 201:
            raise GraphQLError(f"Aanmaken van het alarm is niet gelukt.")
        response_alarm = create_alarm_response.json()["data"]

        afspraak.update({"alarm_id": response_alarm.get("id")})
        update_afspraak_response = requests.post(f"{settings.HHB_SERVICES_URL}/afspraken/{input.afspraakId}", json=afspraak, headers={"Content-type": "application/json"})
        if update_afspraak_response.status_code != 200:
            raise GraphQLError(f"Updaten van afspraak met het nieuwe alarm is niet gelukt.")

        return CreateAlarm(alarm=response_alarm, ok=True)