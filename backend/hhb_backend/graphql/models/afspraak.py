""" Afspraak model as used in GraphQL queries """
from hhb_backend.graphql.models.pageinfo import PageInfo
import graphene

import hhb_backend.graphql.models.afdeling as afdeling
import hhb_backend.graphql.models.burger as burger
import hhb_backend.graphql.models.journaalpost as journaalpost
import hhb_backend.graphql.models.overschrijving as overschrijving
import hhb_backend.graphql.models.postadres as postadres
import hhb_backend.graphql.models.rekening as rekening
import hhb_backend.graphql.models.rubriek as rubriek
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.scalars.bedrag import Bedrag
from hhb_backend.graphql.scalars.day_of_week import DayOfWeekEnum
from hhb_backend.processen.overschrijvingen_planner import (
    PlannedOverschrijvingenInput,
    get_planned_overschrijvingen,
)
from hhb_backend.graphql.utils.dates import to_date
from hhb_backend.graphql.utils.find_matching_afspraken import find_matching_afspraken_by_afspraak, find_similar_afspraken_by_afspraak


class Interval(graphene.ObjectType):
    jaren = graphene.Int()
    maanden = graphene.Int()
    weken = graphene.Int()
    dagen = graphene.Int()


class Betaalinstructie(graphene.ObjectType):
    """Implementatie op basis van http://schema.org/Schedule"""

    '''Lijst van dagen in de week'''
    by_day = graphene.List(DayOfWeekEnum)
    '''Lijst van maanden in het jaar'''
    by_month = graphene.List(graphene.Int)
    '''De dagen van de maand'''
    by_month_day = graphene.List(graphene.Int)
    '''Bijvoorbeeld "P1W" elke week.'''
    repeat_frequency = graphene.String()
    '''Lijst met datums waarop het NIET geldt'''
    except_dates = graphene.List(graphene.String)
    start_date = graphene.String()
    end_date = graphene.String()


class Afspraak(graphene.ObjectType):
    id = graphene.Int()
    uuid = graphene.UUID()
    omschrijving = graphene.String()
    bedrag = graphene.Field(Bedrag)
    credit = graphene.Boolean()
    valid_from = graphene.Date()
    valid_through = graphene.Date()
    rubriek = graphene.Field(lambda: rubriek.Rubriek)
    zoektermen = graphene.List(graphene.String)
    burger_id = graphene.Int()
    burger = graphene.Field(lambda: burger.Burger)
    afdeling = graphene.Field(lambda: afdeling.Afdeling)
    postadres = graphene.Field(lambda: postadres.Postadres)
    alarm_id = graphene.UUID()
    tegen_rekening = graphene.Field(lambda: rekening.Rekening)
    betaalinstructie = graphene.Field(lambda: Betaalinstructie)
    journaalposten = graphene.List(lambda: journaalpost.Journaalpost)
    overschrijvingen = graphene.List(
        lambda: overschrijving.Overschrijving,
        start_datum=graphene.Date(),
        eind_datum=graphene.Date(),
    )
    matching_afspraken = graphene.List(lambda: Afspraak)
    similar_afspraken = graphene.List(lambda: Afspraak)


    def resolve_overschrijvingen(root, info, **kwargs):
        if root.get("betaalinstructie") is None:
            return []

        betaalinstructie = root.get("betaalinstructie")
        planner_input = PlannedOverschrijvingenInput(
            betaalinstructie,
            root.get("bedrag"),
            root.get("id"),
        )
        expected_overschrijvingen = get_planned_overschrijvingen(
            planner_input, **kwargs
        )
        known_overschrijvingen = {}
        overschrijvingen = hhb_dataloader().overschrijvingen.by_afspraak(root.get("id")) or []
        for o in overschrijvingen:
            known_overschrijvingen[o["datum"]] = o
        for datum, o in known_overschrijvingen.items():
            o["datum"] = to_date(o["datum"])
        for o_date in expected_overschrijvingen:
            if o_date in known_overschrijvingen:
                expected_overschrijvingen[o_date] = known_overschrijvingen[o_date]
        return expected_overschrijvingen.values()

    def resolve_rubriek(root, info):
        """ Get rubriek when requested """
        if root.get("rubriek_id"):
            return hhb_dataloader().rubrieken.load_one(root.get("rubriek_id"))

    def resolve_burger(root, info):
        """ Get burger when requested """
        if root.get("burger_id"):
            return hhb_dataloader().burgers.load_one(root.get("burger_id"))

    def resolve_rekening(root, info):
        """ Get rekening when requested """
        if root.get("rekening_id"):
            return hhb_dataloader().rekeningen.load_one(root.get("rekening_id"))

    def resolve_postadres(root, info):
        """ Get postadres when requested """
        postadres_id = root.get("postadres_id", None)
        if postadres_id:
            postadres = hhb_dataloader().postadressen.load_one(postadres_id)
            return postadres

    def resolve_afdeling(root, info):
        """ Get afdeling when requested """
        if root.get("afdeling_id"):
            return hhb_dataloader().afdelingen.load_one(root.get("afdeling_id"))

    def resolve_tegen_rekening(root, info):
        """ Get tegen_rekening when requested """
        if root.get("tegen_rekening_id"):
            return hhb_dataloader().rekeningen.load_one(root.get("tegen_rekening_id"))

    def resolve_valid_from(root, info):
        if value := root.get("valid_from"):
            return to_date(value)

    def resolve_valid_through(root, info):
        if value := root.get("valid_through"):
            return to_date(value)

    def resolve_journaalposten(self, _info):
        """ Get organisatie when requested """
        if self.get("journaalposten"):
            return hhb_dataloader().journaalposten.load(self.get("journaalposten")) or []

    def resolve_matching_afspraken(self, info):
        return find_matching_afspraken_by_afspraak(self) 

    def resolve_similar_afspraken(self, info):
        return find_similar_afspraken_by_afspraak(self) 

class AfsprakenPaged(graphene.ObjectType):
    afspraken = graphene.List(
        Afspraak
    )
    page_info = graphene.Field(lambda: PageInfo)