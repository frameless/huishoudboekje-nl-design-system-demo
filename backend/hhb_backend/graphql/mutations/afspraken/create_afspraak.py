""" GraphQL mutation for creating a new Afspraak """
import graphene
import logging
import requests
from datetime import date
from graphql import GraphQLError

from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
import hhb_backend.graphql.models.afdeling as graphene_afdeling
import hhb_backend.graphql.models.afspraak as graphene_afspraak
from hhb_backend.graphql.models.postadres import Postadres
from hhb_backend.graphql.mutations.afspraken.update_afspraak_betaalinstructie import BetaalinstructieInput
from hhb_backend.graphql.mutations.afspraken.update_afspraak_betaalinstructie import validate_afspraak_betaalinstructie
from hhb_backend.graphql.scalars.bedrag import Bedrag
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity
from hhb_backend.graphql.mutations.json_input_validator import JsonInputValidator


class CreateAfspraakInput(graphene.InputObjectType):
    burger_id = graphene.Int(required=True)
    tegen_rekening_id = graphene.Int(required=True)
    rubriek_id = graphene.Int(required=True)
    omschrijving = graphene.String(required=True)
    bedrag = graphene.Argument(Bedrag, required=True)
    credit = graphene.Boolean(required=True)
    afdeling_id = graphene.Int()
    postadres_id = graphene.String()
    valid_from = graphene.String()
    valid_through = graphene.String()
    zoektermen = graphene.List(graphene.String)
    betaalinstructie = graphene.Argument(lambda: BetaalinstructieInput)


class CreateAfspraak(graphene.Mutation):
    class Arguments:
        input = graphene.Argument(CreateAfspraakInput, required=True)

    ok = graphene.Boolean()
    afspraak = graphene.Field(lambda: graphene_afspraak.Afspraak)

    @staticmethod
    def mutate(self, info, input: CreateAfspraakInput):
        """ Create the new Afspraak """
        logging.info("Creating afspraak")

        validation_schema = {
            "type": "object",
            "oneOf": [
                {
                    "properties": {
                        "omschrijving": {"type": "string", "minLength": 1},
                        "bedrag": {"type": "integer", "minimum": 0},
                        "valid_from": {"type": "string", "format": "date"},
                        "valid_through": {"type": "string", "format": "date"},
                        "zoektermen": {"type": "array", "items": {"type": "string", "minLength": 1}},
                        "postadres_id": {"type": "null"},
                        "afdeling_id": {"type": "null"}
                    },
                    "required": ["postadres_id", "afdeling_id"]
                },
                {
                    "properties": {
                        "omschrijving": {"type": "string", "minLength": 1},
                        "bedrag": {"type": "integer", "minimum": 0},
                        "valid_from": {"type": "string", "format": "date"},
                        "valid_through": {"type": "string", "format": "date"},
                        "zoektermen": {"type": "array", "items": {"type": "string", "minLength": 1}},
                        "postadres_id": {"type": "string", "format": "uuid"},
                        "afdeling_id": {"type": "integer", "minimum": 0}
                    },
                    "required": ["postadres_id", "afdeling_id"]
                }
            ]
        }
        JsonInputValidator(validation_schema).validate(input)

        if "valid_from" not in input:
            input["valid_from"] = str(date.today())

        # check burger_id
        burger = hhb_dataloader().burgers.load_one(input.burger_id)
        if not burger:
            raise GraphQLError("burger not found")

        # Check tegen_rekening_id
        rekening = hhb_dataloader().rekeningen.load_one(input.tegen_rekening_id)
        if not rekening:
            raise GraphQLError("rekening not found")

        # check rubriek_id
        rubriek = hhb_dataloader().rubrieken.load_one(input.rubriek_id)
        if not rubriek:
            raise GraphQLError("rubriek not found")

        # check afdeling_id - optional
        afdeling_id = input.get("afdeling_id")
        if afdeling_id is not None:
            afdeling_result: graphene_afdeling.Afdeling = hhb_dataloader(
            ).afdelingen.load_one(afdeling_id)
            if not afdeling_result:
                raise GraphQLError("afdeling not found")

        # Check postadres_id - optional
        postadres_id = input.get("postadres_id")
        if postadres_id is not None:
            postadres: Postadres = hhb_dataloader().postadressen.load_one(postadres_id)
            if not postadres:
                raise GraphQLError("postadres not found")

        # Check betaalinstructie - optional
        betaalinstructie = input.get("betaalinstructie")
        if betaalinstructie is not None:
            try:
                validate_afspraak_betaalinstructie(
                    input.get("credit"), input.betaalinstructie)
            except Exception as e:
                logging.exception(f"Invalid betaalinstructie {e}")
                raise e

        # final create call
        response = requests.post(
            f"{settings.HHB_SERVICES_URL}/afspraken/", json=input)
        if response.status_code != 201:
            raise GraphQLError(f"Upstream API responded: {response.text}")
        afspraak = response.json()["data"]

        entities = [GebruikersActiviteitEntity(entityType="afspraak", entityId=afspraak["id"]),
                    GebruikersActiviteitEntity(
            entityType="burger", entityId=afspraak["burger_id"])]
        if afspraak["afdeling_id"] != None:
            entities.append(GebruikersActiviteitEntity(
                entityType="afdeling", entityId=afspraak["afdeling_id"]))

        logging.warning(entities)

        AuditLogging.create(
            action=info.field_name,
            entities=entities,
            after=dict(afspraak=afspraak),
        )

        return CreateAfspraak(afspraak=afspraak, ok=True)
