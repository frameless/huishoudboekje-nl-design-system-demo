""" GraphQL mutation for updating an Afspraak """

import logging
import graphene
from hhb_backend.update_end_date_alarm import UpdateEndDateAlarm
import requests

import hhb_backend.graphql.models.afspraak as graphene_afspraak
from graphql import GraphQLError
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.scalars.bedrag import Bedrag
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity
from hhb_backend.graphql.utils.upstream_error_handler import UpstreamError
from hhb_backend.graphql.mutations.json_input_validator import JsonInputValidator


class UpdateAfspraakInput(graphene.InputObjectType):
    burger_id = graphene.Int()
    afdeling_id = graphene.Int()
    postadres_id = graphene.String()
    tegen_rekening_id = graphene.Int()
    rubriek_id = graphene.Int()
    omschrijving = graphene.String()
    credit = graphene.Boolean()
    bedrag = graphene.Argument(Bedrag)
    valid_from = graphene.String()
    valid_through = graphene.String()
    zoektermen = graphene.List(graphene.String)


class UpdateAfspraak(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        input = graphene.Argument(UpdateAfspraakInput, required=True)

    ok = graphene.Boolean()
    afspraak = graphene.Field(lambda: graphene_afspraak.Afspraak)
    previous = graphene.Field(lambda: graphene_afspraak.Afspraak)

    @staticmethod
    def mutate(self, info, id: int, input: UpdateAfspraakInput):
        """ Update the Afspraak """
        logging.info(f"Updating afspraak: {id}")
        
        validation_schema = {
            "type": "object",
            "oneOf": [
                {
                    "properties": {
                        "omschrijving": {"type": "string","minLength": 1},
                        "bedrag": {"type": "integer", "minimum": 0},
                        "valid_from": {"type": "string", "format": "date"},
                        "valid_through": {"type": "string", "format": "date"},
                        "zoektermen": {  "type": "array", "items": {"type": "string", "minLength": 1 } },
                        "postadres_id": { "type": "null" },
                        "afdeling_id": { "type": "null" }
                    },
                    "required": ["postadres_id","afdeling_id"]
                },
                {
                    "properties": {
                        "omschrijving": {"type": "string","minLength": 1},
                        "bedrag": {"type": "integer", "minimum": 0},
                        "valid_from": {"type": "string", "format": "date"},
                        "valid_through": {"type": "string", "format": "date"},
                        "zoektermen": {  "type": "array", "items": {"type": "string", "minLength": 1 } },
                        "postadres_id": {"type": "string","format": "uuid"},
                        "afdeling_id": { "type": "integer", "minimum": 0 }
                    },
                    "required": ["postadres_id","afdeling_id"]
                },
                {
                    "properties": {
                        "omschrijving": {"type": "string","minLength": 1},
                        "bedrag": {"type": "integer", "minimum": 0},
                        "valid_from": {"type": "string", "format": "date"},
                        "valid_through": {"type": "string", "format": "date"},
                        "zoektermen": {  "type": "array", "items": {"type": "string", "minLength": 1 } }
                    },
                    "additionalProperties": False
                }
            ]
        }
        JsonInputValidator(validation_schema).validate(input)

        previous = hhb_dataloader().afspraken.load_one(id)
        if not previous:
            raise GraphQLError("afspraak not found")

        # check burger_id - optional
        burger_id = input.get("burger_id")
        if burger_id:
            burger = hhb_dataloader().burgers.load_one(burger_id)
            if not burger:
                raise GraphQLError("burger not found")

        # Check tegen_rekening_id - optional
        rekening_id = input.get("tegen_rekening_id")
        if rekening_id:
            rekening = hhb_dataloader().rekeningen.load_one(rekening_id)
            if not rekening:
                raise GraphQLError("rekening not found")

        # check rubriek_id - optional
        rubriek_id = input.get("rubriek_id")
        if rubriek_id:
            rubriek = hhb_dataloader().rubrieken.load_one(rubriek_id)
            if not rubriek:
                raise GraphQLError("rubriek not found")

        # check afdeling_id - optional
        afdeling_id = input.get("afdeling_id")
        if afdeling_id is not None:
            afdeling = hhb_dataloader().afdelingen.load_one(afdeling_id)
            if not afdeling:
                raise GraphQLError("afdeling not found")

        # Check postadres_id - optional
        postadres_id = input.get("postadres_id")
        if postadres_id is not None:
            postadres = hhb_dataloader().postadressen.load_one(postadres_id)
            if not postadres:
                raise GraphQLError("postadres not found")

        # final update call
        response = requests.post(f"{settings.HHB_SERVICES_URL}/afspraken/{id}", json=input)
        if not response.ok:
            raise UpstreamError(response, "updating afspraak failed")

        afspraak = response.json()["data"]

        if afspraak["alarm_id"]:
            updated_end_date = input.get("valid_through")
            if updated_end_date is not None and updated_end_date is not "":
                UpdateEndDateAlarm.create(alarmUuid=afspraak["alarm_id"], newEndDate=updated_end_date)

        AuditLogging.create(
            action=info.field_name,
            entities=[
                GebruikersActiviteitEntity(entityType="afspraak", entityId=id),
                GebruikersActiviteitEntity(entityType="burger", entityId=afspraak["burger_id"]),
                GebruikersActiviteitEntity(entityType="afdeling", entityId=afspraak["afdeling_id"])
            ],
            before=dict(afspraak=previous),
            after=dict(afspraak=afspraak),
        )

        return UpdateAfspraak(afspraak=afspraak, previous=previous, ok=True)
