""" GraphQL Gebruikers query """
import graphene
from flask import request
from hhb_backend.graphql.models.afspraak import IntervalInput
from hhb_backend.graphql.scalars.bedrag import Bedrag
from hhb_backend.graphql.models.overschrijving import Overschrijving
from hhb_backend.graphql.utils.overschrijvingen_planner import PlannedOverschijvingenInput, get_planned_overschrijvingen
from hhb_backend.graphql.utils.interval import convert_hhb_interval_to_iso
from logging import getLogger

log = getLogger(__name__)

class PlannedOverschijvingenQueryInput(graphene.InputObjectType):
    afspraak_start_datum=graphene.Date(required=True)
    interval=graphene.Argument(lambda: IntervalInput, required=True)
    aantal_betalingen=graphene.Int(required=True)
    bedrag=graphene.Argument(Bedrag, required=True)
    start_datum=graphene.Date()
    eind_datum=graphene.Date()

class PlannedOverschijvingenQuery():
    return_type = graphene.List(Overschrijving, input=graphene.Argument(PlannedOverschijvingenQueryInput, required=True))

    @staticmethod
    async def resolver(root, info, **kwargs):
        input_data = kwargs["input"]
        planner_input = PlannedOverschijvingenInput(
            input_data["afspraak_start_datum"].isoformat(),
            convert_hhb_interval_to_iso(input_data["interval"]),
            input_data["aantal_betalingen"],
            input_data["bedrag"]
        )
        overschijvingen = get_planned_overschrijvingen(
            planner_input,
            start_datum=input_data.get("start_datum", None),
            eind_datum=input_data.get("eind_datum", None)
        )
        return overschijvingen.values()
