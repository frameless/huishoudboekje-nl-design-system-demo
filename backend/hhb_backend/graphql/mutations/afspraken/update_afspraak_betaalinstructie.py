import graphene
import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models import afspraak
from hhb_backend.graphql.scalars.day_of_week import DayOfWeek
from hhb_backend.graphql.utils.gebruikersactiviteiten import (gebruikers_activiteit_entities, log_gebruikers_activiteit)


class BetaalinstructieInput(graphene.InputObjectType):
    """Implementatie op basis van http://schema.org/Schedule"""
    '''Lijst van dagen in de week'''
    by_day = graphene.List(DayOfWeek)
    '''Lijst van maanden in het jaar'''
    by_month = graphene.List(graphene.Int)
    '''De dagen van de maand'''
    by_month_day = graphene.List(graphene.Int)
    '''Bijvoorbeeld "P1W" elke week.'''
    repeat_frequency = graphene.String()
    '''Lijst met datums waarop het NIET geldt'''
    except_dates = graphene.List(graphene.String)
    start_date = graphene.String(required=True)
    end_date = graphene.String()


class UpdateAfspraakBetaalinstructie(graphene.Mutation):
    """Mutatie voor het instellen van een nieuwe betaalinstructie voor een afspraak."""
    class Arguments:
        afspraak_id = graphene.Int(required=True)
        betaalinstructie = graphene.Argument(lambda: BetaalinstructieInput, required=True)

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
    async def mutate(_root, _info, afspraak_id: int, betaalinstructie: BetaalinstructieInput):
        """ Update the Afspraak """

        previous = hhb_dataloader().afspraken.load_one(afspraak_id)

        if previous is None:
            raise GraphQLError("afspraak not found")

        # These arrays contains ids for their entities and not the instances, the hhb_service does not understand that,
        # Since removing them from the payload makes the service ignore them for updating purposes it is safe to remove
        # them here.
        del previous.journaalposten
        del previous.overschrijvingen

        if previous.credit:
            raise GraphQLError("Betaalinstructie is alleen mogelijk bij uitgaven")
        if (betaalinstructie.by_day and betaalinstructie.by_month_day) or (not betaalinstructie.by_day and not betaalinstructie.by_month_day):
            raise GraphQLError("Betaalinstructie: 'by_day' of 'by_month_day' moet zijn ingevuld.")
        if betaalinstructie.end_date and betaalinstructie.end_date < betaalinstructie.start_date:
            raise GraphQLError("Begindatum moet voor einddatum liggen.")

        input = {
            "betaalinstructie": betaalinstructie
        }

        response = requests.post(
            f"{settings.HHB_SERVICES_URL}/afspraken/{afspraak_id}",
            json=input,
        )
        if not response.ok:
            raise GraphQLError(f"Upstream API responded: {response.text}")

        afspraak = response.json()["data"]

        return UpdateAfspraakBetaalinstructie(afspraak=afspraak, previous=previous, ok=True)
