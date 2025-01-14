import logging

import graphene
import requests

from graphql import GraphQLError
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models import afspraak
from hhb_backend.graphql.scalars.day_of_week import DayOfWeekEnum
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity
from hhb_backend.graphql.utils.upstream_error_handler import UpstreamError
from hhb_backend.graphql.mutations.json_input_validator import JsonInputValidator


class BetaalinstructieInput(graphene.InputObjectType):
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

    @staticmethod
    def mutate(self, info, afspraak_id: int, betaalinstructie: BetaalinstructieInput):
        """ Update the Afspraak """
        logging.info(f"Updating afspraak: {afspraak_id}")

        validation_schema = {
            "type": "object", 
            "properties": {
                "by_day" :{ "type": "array","prefixItems": [ { "type": "string" }, { "enum": ["Monday", "Tuesday", "Wednesday","Thursday","Friday","Saturday","Sunday"] },]},
                "by_month": { "type": "array",  "items": { "type": "integer", "minimum": 1, "maximum": 12 }},
                "by_month_day": { "type": "array", "items": {"type": "integer","minimum": 1, "maximum": 31}},
                "repeat_frequency": {"type": "string","minLength": 0},
                "except_dates": {"type": "array",  "items": {"type": "string","minLength": 1}},
                "start_date": {"type": "string", "format": "date"},
                "end_date": {"type": "string", "format": "date"}
            }
        }
        JsonInputValidator(validation_schema).validate(betaalinstructie)


        previous = hhb_dataloader().afspraken.load_one(afspraak_id)

        if previous is None:
            raise GraphQLError("Afspraak not found")

        input = {
            "betaalinstructie": betaalinstructie
        }
        try:
            validate_afspraak_betaalinstructie(previous.credit, betaalinstructie)
        except Exception as e:
            logging.exception(f"Invalid betaalinstructie")
            logging.debug(f"Invalid betaalinstructie {e}")
            raise e

        response = requests.post(
            f"{settings.HHB_SERVICES_URL}/afspraken/{afspraak_id}",
            json=input,
        )
        if not response.ok:
            raise UpstreamError(response, "Failed to update afspraak")

        new_afspraak = {
            **previous,
            **input
        }

        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="afspraak", entityId=afspraak_id),
                GebruikersActiviteitEntity(entityType="burger", entityId=new_afspraak["burger_id"])
            ],
            before=dict(afspraak=previous),
            after=dict(afspraak=new_afspraak),
        )

        return UpdateAfspraakBetaalinstructie(afspraak=new_afspraak, previous=previous, ok=True)


def validate_afspraak_betaalinstructie(is_credit: bool, betaalinstructie: BetaalinstructieInput):
    """Update the Afspraak"""

    if is_credit:
        raise GraphQLError("Betaalinstructie is only possible for expenses.")
    if (betaalinstructie.by_day and betaalinstructie.by_month_day) or (
        not betaalinstructie.by_day and not betaalinstructie.by_month_day):
        raise GraphQLError("Betaalinstructie: 'by_day' or 'by_month_day' is required.")
    if betaalinstructie.end_date and betaalinstructie.end_date < betaalinstructie.start_date:
        raise GraphQLError("StartDate has to be before endDate.")
