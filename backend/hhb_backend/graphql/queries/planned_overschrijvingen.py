""" GraphQL Gebruikers query """
import graphene

from hhb_backend.graphql.mutations.afspraken.update_afspraak_betaalinstructie import BetaalinstructieInput
from hhb_backend.graphql.scalars.bedrag import Bedrag
from hhb_backend.graphql.models.overschrijving import Overschrijving
from hhb_backend.graphql.utils.interval import convert_betaalinstructie_interval
from hhb_backend.processen.overschrijvingen_planner import (
    PlannedOverschijvingenInput,
    get_planned_overschrijvingen,
)
from logging import getLogger

log = getLogger(__name__)


class PlannedOverschijvingenQueryInput(graphene.InputObjectType):
    betaalinstructie = graphene.Argument(lambda: BetaalinstructieInput, required=True)
    bedrag = graphene.Argument(Bedrag, required=True)
    start_datum = graphene.Date()
    eind_datum = graphene.Date()


class PlannedOverschijvingenQuery:
    return_type = graphene.List(
        Overschrijving,
        input=graphene.Argument(PlannedOverschijvingenQueryInput, required=True),
    )

    @classmethod
    async def resolver(cls, _root, _info, input: PlannedOverschijvingenQueryInput, **kwargs):
        betaalinstructie = input["betaalinstructie"]
        planner_input = PlannedOverschijvingenInput(
            betaalinstructie.start_date.isoformat(),
            convert_betaalinstructie_interval(betaalinstructie),
            betaalinstructie.repeat_count,
            input["bedrag"],
        )
        overschijvingen = get_planned_overschrijvingen(
            planner_input,
            start_datum=input.get("start_datum", None),
            eind_datum=input.get("eind_datum", None),
        )
        return overschijvingen.values()
