""" Afspraak model as used in GraphQL queries """
from datetime import date
from dateutil.parser import isoparse
import graphene
from flask import request
import hhb_backend.graphql.models.burger as burger
import hhb_backend.graphql.models.rekening as rekening
import hhb_backend.graphql.models.organisatie as organisatie
import hhb_backend.graphql.models.journaalpost as journaalpost
import hhb_backend.graphql.models.rubriek as rubriek
import hhb_backend.graphql.models.overschrijving as overschrijving
from hhb_backend.graphql.scalars.bedrag import Bedrag
from hhb_backend.graphql.utils import convert_hhb_interval_to_dict
from hhb_backend.processen.overschrijvingen_planner import (
    PlannedOverschijvingenInput,
    get_planned_overschrijvingen,
)


class Interval(graphene.ObjectType):
    jaren = graphene.Int()
    maanden = graphene.Int()
    weken = graphene.Int()
    dagen = graphene.Int()


class IntervalInput(graphene.InputObjectType):
    jaren = graphene.Int()
    maanden = graphene.Int()
    weken = graphene.Int()
    dagen = graphene.Int()


class Afspraak(graphene.ObjectType):
    """ GraphQL Afspraak model """

    id = graphene.Int()
    burger = graphene.Field(lambda: burger.Burger)
    beschrijving = graphene.String()
    start_datum = graphene.Date()
    eind_datum = graphene.Date()
    aantal_betalingen = graphene.Int()
    interval = graphene.Field(Interval)
    tegen_rekening = graphene.Field(lambda: rekening.Rekening)
    bedrag = graphene.Field(Bedrag)
    credit = graphene.Boolean()
    kenmerk = graphene.String()
    actief = graphene.Boolean()
    automatische_incasso = graphene.Boolean()
    automatisch_boeken = graphene.Boolean()
    organisatie = graphene.Field(lambda: organisatie.Organisatie)
    journaalposten = graphene.List(lambda: journaalpost.Journaalpost)
    rubriek = graphene.Field(lambda: rubriek.Rubriek)
    overschrijvingen = graphene.List(
        lambda: overschrijving.Overschrijving,
        start_datum=graphene.Date(),
        eind_datum=graphene.Date(),
    )

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
        value = root.get("start_datum")
        if value:
            return date.fromisoformat(value)

    def resolve_eind_datum(root, info):
        value = root.get("eind_datum")
        if value:
            return date.fromisoformat(value)

    def resolve_interval(root, info):
        value = root.get("interval")
        if value:
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
