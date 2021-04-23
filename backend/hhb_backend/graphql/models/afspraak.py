""" Afspraak model as used in GraphQL queries """
from datetime import date

import graphene
from dateutil.parser import isoparse
from flask import request

import hhb_backend.graphql.models.burger as burger
import hhb_backend.graphql.models.journaalpost as journaalpost
import hhb_backend.graphql.models.organisatie as organisatie
import hhb_backend.graphql.models.overschrijving as overschrijving
import hhb_backend.graphql.models.rekening as rekening
import hhb_backend.graphql.models.rubriek as rubriek
from hhb_backend.graphql.scalars.bedrag import Bedrag
from hhb_backend.graphql.scalars.day_of_week import DayOfWeek
from hhb_backend.graphql.utils.interval import convert_hhb_interval_to_dict, convert_iso_duration_to_schedule_by_day, \
    convert_iso_duration_to_schedule_by_month
from hhb_backend.processen.automatisch_boeken import find_matching_afspraken_by_afspraak
from hhb_backend.processen.overschrijvingen_planner import (
    PlannedOverschijvingenInput,
    get_planned_overschrijvingen,
)


class Interval(graphene.ObjectType):
    jaren = graphene.Int()
    maanden = graphene.Int()
    weken = graphene.Int()
    dagen = graphene.Int()


class Betaalinstructie(graphene.ObjectType):
    """Implementatie op basis van http://schema.org/Schedule"""

    '''Lijst van dagen in de week'''
    by_day = graphene.List(DayOfWeek, default_value=[])
    '''Lijst van maanden in het jaar'''
    by_month = graphene.List(graphene.Int, default_value=[])
    '''De dagen van de maand'''
    by_month_day = graphene.List(graphene.Int, default_value=[])
    '''Bijvoorbeeld "P1W" elke week.'''
    repeat_frequency = graphene.String()
    '''Lijst met datums waarop het NIET geldt'''
    except_dates = graphene.List(graphene.String, default_value=[])
    start_date = graphene.String()
    end_date = graphene.String()


class Afspraak(graphene.ObjectType):
    """ GraphQL Afspraak model """

    id = graphene.Int()
    burger = graphene.Field(lambda: burger.Burger)
    omschrijving = graphene.String()
    tegen_rekening = graphene.Field(lambda: rekening.Rekening)
    bedrag = graphene.Field(Bedrag)
    credit = graphene.Boolean()
    zoektermen = graphene.List(graphene.String)
    betaalinstructie = graphene.Field(lambda: Betaalinstructie)
    organisatie = graphene.Field(lambda: organisatie.Organisatie)
    journaalposten = graphene.List(lambda: journaalpost.Journaalpost)
    rubriek = graphene.Field(lambda: rubriek.Rubriek)
    overschrijvingen = graphene.List(
        lambda: overschrijving.Overschrijving,
        start_datum=graphene.Date(),
        eind_datum=graphene.Date(),
    )
    matching_afspraken = graphene.List(lambda: Afspraak)
    valid_from = graphene.Date()
    valid_through = graphene.Date()

    automatische_incasso = graphene.Boolean(deprecation_reason='use betaalinstructie instead')

    async def resolve_overschrijvingen(root, info, **kwargs):
        if root.get("betaalinstructie") is None:
            return []

        betaalinstructie = root.get("betaalinstructie")
        planner_input = PlannedOverschijvingenInput(
            betaalinstructie,
            root.get("bedrag"),
            root.get("id"),
        )
        expected_overschrijvingen = get_planned_overschrijvingen(
            planner_input, **kwargs
        )
        known_overschrijvingen = {}
        overschrijvingen = (
                await request.dataloader.overschrijvingen_by_afspraak.load(root.get("id"))
                or []
        )
        for o in overschrijvingen:
            known_overschrijvingen[o["datum"]] = o
        for datum, o in known_overschrijvingen.items():
            o["datum"] = isoparse(o["datum"]).date()
        for o_date in expected_overschrijvingen:
            if o_date in known_overschrijvingen:
                expected_overschrijvingen[o_date] = known_overschrijvingen[o_date]
        return expected_overschrijvingen.values()

    async def resolve_rubriek(root, info):
        """ Get rubriek when requested """
        if root.get("rubriek_id"):
            return await request.dataloader.rubrieken_by_id.load(root.get("rubriek_id"))

    async def resolve_burger(root, info):
        """ Get burger when requested """
        if root.get("burger_id"):
            return await request.dataloader.burgers_by_id.load(
                root.get("burger_id")
            )

    async def resolve_tegen_rekening(root, info):
        """ Get tegen_rekening when requested """
        if root.get("tegen_rekening_id"):
            return await request.dataloader.rekeningen_by_id.load(
                root.get("tegen_rekening_id")
            )

    def resolve_valid_from(root, info):
        if value := root.get("valid_from"):
            return date.fromisoformat(value)

    def resolve_valid_through(root, info):
        if value := root.get("valid_through"):
            return date.fromisoformat(value)

    async def resolve_organisatie(root, info):
        """ Get organisatie when requested """
        if root.get("organisatie_id"):
            return await request.dataloader.organisaties_by_id.load(
                root.get("organisatie_id")
            )

    async def resolve_journaalposten(root, info):
        """ Get organisatie when requested """
        if root.get("journaalposten"):
            return (
                    await request.dataloader.journaalposten_by_id.load_many(
                        root.get("journaalposten")
                    )
                    or []
            )

    async def resolve_matching_afspraken(root, info):
        return await find_matching_afspraken_by_afspraak(root)
