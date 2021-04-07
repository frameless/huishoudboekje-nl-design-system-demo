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
    start_date = graphene.Date()
    end_date = graphene.Date()
    '''Het aantal keer dat deze ingepland moet worden'''
    repeat_count = graphene.Int()
    '''Lijst van dagen in de week'''
    by_day = graphene.List(DayOfWeek)
    '''De dag van de maand'''
    by_month_day = graphene.Int()
    '''Lijst van maanden in het jaar'''
    by_month = graphene.List(graphene.Int)

    @staticmethod
    def resolve_start_date(root, _info):
        if value := root.get("start_datum"):  # TODO rename to start_date in service
            return date.fromisoformat(value)

    @staticmethod
    def resolve_end_date(root, _info):
        if value := root.get("eind_datum"):  # TODO rename to end_date in service
            return date.fromisoformat(value)

    @staticmethod
    def resolve_repeat_count(root, _info):
        if value := root.get("aantal_betalingen"):  # TODO rename to repeat_count in service
            return value

    @staticmethod
    def resolve_by_day(root, info):
        if value := root.get("interval"):
            if start_date := Betaalinstructie.resolve_start_date(root, info):
                return convert_iso_duration_to_schedule_by_day(value, start_date)

    @staticmethod
    def resolve_by_month_day(root, info):
        if start_date := Betaalinstructie.resolve_start_date(root, info):
            return start_date.day

    @staticmethod
    def resolve_by_month(root, info):
        if value := root.get("interval"):
            if start_date := Betaalinstructie.resolve_start_date(root, info):
                return convert_iso_duration_to_schedule_by_month(value, start_date)


class Afspraak(graphene.ObjectType):
    """ GraphQL Afspraak model """

    id = graphene.Int()
    burger = graphene.Field(lambda: burger.Burger)
    omschrijving = graphene.String()
    tegen_rekening = graphene.Field(lambda: rekening.Rekening)
    bedrag = graphene.Field(Bedrag)
    credit = graphene.Boolean()
    zoektermen = graphene.List(graphene.String)
    actief = graphene.Boolean()
    betaalinstructie = graphene.Field(lambda: Betaalinstructie)
    automatisch_boeken = graphene.Boolean()
    organisatie = graphene.Field(lambda: organisatie.Organisatie)
    journaalposten = graphene.List(lambda: journaalpost.Journaalpost)
    rubriek = graphene.Field(lambda: rubriek.Rubriek)
    overschrijvingen = graphene.List(
        lambda: overschrijving.Overschrijving,
        start_datum=graphene.Date(),
        eind_datum=graphene.Date(),
    )
    matching_afspraken = graphene.List(lambda: Afspraak)

    start_datum = graphene.Date(deprecation_reason='use betaalinstructie instead')
    eind_datum = graphene.Date(deprecation_reason='use betaalinstructie instead')
    interval = graphene.Field(Interval, deprecation_reason='use betaalinstructie instead')
    aantal_betalingen = graphene.Int(deprecation_reason='use betaalinstructie instead')
    beschrijving = graphene.String(deprecation_reason='use omschrijving instead')
    automatische_incasso = graphene.Boolean(deprecation_reason='use betaalinstructie instead')

    @staticmethod
    def resolve_betaalinstructie(root, _info):
        if root.get('aantal_betalingen') or root.get('eind_datum'):
            return root

    async def resolve_overschrijvingen(root, info, **kwargs):
        planner_input = PlannedOverschijvingenInput(
            root.get("start_datum"),
            root.get("interval"),
            root.get("aantal_betalingen"),
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

    def resolve_start_datum(root, info):
        if value := root.get("start_datum"):
            return date.fromisoformat(value)

    def resolve_eind_datum(root, info):
        if value := root.get("eind_datum"):
            return date.fromisoformat(value)

    def resolve_interval(root, info):
        if value := root.get("interval"):
            return convert_hhb_interval_to_dict(value)
        else:
            return {"jaren": 0, "maanden": 0, "weken": 0, "dagen": 0}

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
