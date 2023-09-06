""" GraphQL mutation for updating a Burger """
import json
import logging

import graphene
import requests

import hhb_backend.graphql.models.burger as graphene_burger
from graphql import GraphQLError
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.mutations.huishoudens import huishouden_input as huishouden_input
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity
from hhb_backend.service.model import burger
from hhb_backend.graphql.mutations.json_input_validator import JsonInputValidator


class UpdateBurger(graphene.Mutation):
    class Arguments:
        # burger arguments
        id = graphene.Int(required=True)
        bsn = graphene.Int()
        voorletters = graphene.String()
        voornamen = graphene.String()
        achternaam = graphene.String()
        geboortedatum = graphene.String()
        telefoonnummer = graphene.String()
        email = graphene.String()
        straatnaam = graphene.String()
        huisnummer = graphene.String()
        postcode = graphene.String()
        plaatsnaam = graphene.String()
        huishouden = graphene.Argument(lambda: huishouden_input.HuishoudenInput)

    ok = graphene.Boolean()
    burger = graphene.Field(lambda: graphene_burger.Burger)
    previous = graphene.Field(lambda: graphene_burger.Burger)

    @staticmethod
    def mutate(self, info, id, **kwargs):
        """ Update the current Gebruiker/Burger """
        logging.info(f"Updating burger {id}")

        validation_schema = {
            "type": "object",
            "properties": {
                "bsn": {"type": "integer"},
                "voorletters": {"type": "string", "pattern": "^([A-Z]\.)+$"},
                "voornamen": {"type": "string", "minLength": 1},
                "achternaam": {"type": "string","minLength": 1},
                "geboortedatum": {"type": "string", "pattern": "^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$"}, #date
                "telefoonnummer": {"anyOf": [
                    {"type": "string", "pattern": "^(((\+31|0|0031)6){1}[1-9]{1}[0-9]{7})$"}, #MobilePhoneNL
                    {"type": "string", "pattern": "^(((0)[1-9]{2}[0-9][-]?[1-9][0-9]{5})|((\\+31|0|0031)[1-9][0-9][-]?[1-9][0-9]{6}))$"} #PhoneNumberNL
                ]},
                "email": {"type": "string", "pattern": "^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$"},
                "straatnaam": {"type": "string","minlength": 1}, 
                "huisnummer": {"type": "string", "minlength": 1},
                "postcode": {"type": "string", "pattern": "^[1-9][0-9]{3}[A-Za-z]{2}$"}, #ZipcodeNL
                "plaatsnaam": {"type": "string","minlength": 1},
                "saldo": {  "type": "integer", "minimum": 1 }
            },
            "required": []
        }
        JsonInputValidator(validation_schema).validate(input)



        previous = hhb_dataloader().burgers.load_one(id)

        bsn = kwargs.get("bsn")
        if bsn is not None:
            graphene_burger.Burger.bsn_length(bsn)
            graphene_burger.Burger.bsn_elf_proef(bsn)

        response = requests.post(
            f"{settings.HHB_SERVICES_URL}/burgers/{id}",
            data=json.dumps(kwargs),
            headers={"Content-type": "application/json"},
        )
        if response.status_code != 200:
            raise GraphQLError(f"Upstream API responded: {response.json()}")

        updated_burger = burger.Burger(response.json()["data"])

        entities = [
            GebruikersActiviteitEntity(entityType="burger", entityId=id),
        ]

        if "rekeningen" in updated_burger:
            entities.extend([
                GebruikersActiviteitEntity(entityType="rekening", entityId=rekening["id"])
                for rekening in updated_burger.rekeningen
            ])

        AuditLogging.create(
            action=info.field_name,
            entities=entities,
            before=dict(burger=previous),
            after=dict(burger=updated_burger),
        )

        return UpdateBurger(ok=True, burger=updated_burger, previous=previous)
