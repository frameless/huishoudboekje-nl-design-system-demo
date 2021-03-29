""" GraphQL mutation for updating an Afspraak """

import graphene
import pydash
import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models import afspraak
from hhb_backend.graphql.scalars.day_of_week import DayOfWeek
from hhb_backend.graphql.utils.gebruikersactiviteiten import (gebruikers_activiteit_entities, log_gebruikers_activiteit)


class BetaalinstructieInput(graphene.InputObjectType):
    start_datum = graphene.String(required=True)
    eind_datum = graphene.String()

    """
    Array van dagen, bijvoorbeeld [3, 7] voor "elke woensdag en zondag"
    """
    by_day = graphene.List(DayOfWeek)
    """
    De dag van de maand, bijvoorbeeld "25" voor "de 25 dag van de maand"
    """
    by_month_day = graphene.Int()
    """
    Array van maanden, bijvoorbeeld [5, 9] voor "in mei en september"
    """
    by_month = graphene.List(graphene.Int) #

    aantal_betalingen = graphene.Int(required=True)


class UpdateAfspraakBetaalinstructie(graphene.Mutation):
    class Arguments:
        afspraak_id = graphene.Int(required=True)
        automatisch_boeken = graphene.Boolean(required=True)

    ok = graphene.Boolean()
    afspraak = graphene.Field(lambda: afspraak.Afspraak)
    previous = graphene.Field(lambda: afspraak.Afspraak)

    def gebruikers_activiteit(self, _root, info, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="afspraak", result=self, key="afspraak"
            )
            + gebruikers_activiteit_entities(
                entity_type="burger", result=self.afspraak, key="burger_id"
            ),
            before=dict(afspraak=self.previous),
            after=dict(afspraak=self.afspraak),
        )

    @staticmethod
    @log_gebruikers_activiteit
    async def mutate(_root, _info, afspraak_id: int, automatisch_boeken: bool):
        """ Update the Afspraak """

        previous = await hhb_dataloader().afspraken_by_id.load(afspraak_id)

        if previous is None:
            raise GraphQLError("afspraak not found")

        # These arrays contains ids for their entities and not the instances, the hhb_service does not understand that,
        # Since removing them from the payload makes the service ignore them for updating purposes it is safe to remove
        # them here.
        previous = pydash.omit(previous, 'journaalposten', 'overschrijvingen')

        input = {
            **previous,
            "automatisch_boeken": automatisch_boeken,
        }

        response = requests.post(
            f"{settings.HHB_SERVICES_URL}/afspraken/{afspraak_id}",
            json=input,
        )
        if not response.ok:
            raise GraphQLError(f"Upstream API responded: {response.text}")

        afspraak = response.json()["data"]

        return UpdateAfspraakBetaalInstructie(afspraak=afspraak, previous=previous, ok=True)
