""" GraphQL mutation for creating a new Burger """
import json
import logging

import graphene
import requests

import hhb_backend.graphql.models.burger as graphene_burger
import hhb_backend.graphql.mutations.huishoudens.huishouden_input as huishouden_input
import hhb_backend.graphql.mutations.rekeningen.rekening_input as rekening_input
from graphql import GraphQLError
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql import settings
from hhb_backend.graphql.mutations.huishoudens.utils import create_huishouden_if_not_exists
from hhb_backend.graphql.mutations.rekeningen.utils import create_burger_rekening
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity
from hhb_backend.service.model import burger


class CreateBurgerInput(graphene.InputObjectType):
    bsn = graphene.Int()
    voorletters = graphene.String()
    voornamen = graphene.String()
    achternaam = graphene.String()
    geboortedatum = graphene.Date()
    telefoonnummer = graphene.String()
    email = graphene.String()
    straatnaam = graphene.String()
    huisnummer = graphene.String()
    postcode = graphene.String()
    plaatsnaam = graphene.String()
    rekeningen = graphene.List(lambda: rekening_input.RekeningInput)
    huishouden = graphene.Argument(huishouden_input.HuishoudenInput)
    saldo = graphene.Int()


class CreateBurger(graphene.Mutation):
    class Arguments:
        input = graphene.Argument(CreateBurgerInput)

    ok = graphene.Boolean()
    burger = graphene.Field(lambda: graphene_burger.Burger)

    @staticmethod
    def mutate(self, info, input):
        """ Create the new Burger """
        logging.info("Creating burger")

        bsn = input.get('bsn')
        graphene_burger.Burger.bsn_length(bsn)
        graphene_burger.Burger.bsn_elf_proef(bsn)

        rekeningen = input.pop("rekeningen", None)

        huishouden = create_huishouden_if_not_exists(
            huishouden=input.pop("huishouden", {}))
        input["huishouden_id"] = huishouden.id

        response = requests.post(
            f"{settings.HHB_SERVICES_URL}/burgers/",
            data=json.dumps(input, default=str),
            headers={"Content-type": "application/json"},
        )
        if response.status_code != 201:
            raise GraphQLError(f"Upstream API responded: {response.json()}")

        created_burger = burger.Burger(response.json()["data"])
        entities = [
            GebruikersActiviteitEntity(
                entityType="burger", entityId=created_burger.id),
        ]

        if rekeningen:
            created_burger.rekeningen = [
                create_burger_rekening(created_burger.id, rekening)
                for rekening in rekeningen
            ]

            rekeningen_entities = [GebruikersActiviteitEntity(entityType="rekening", entityId=rekening["id"]) for
                                   rekening in
                                   created_burger.rekeningen]
            logging.debug(f"Rekeningen entities: {rekeningen_entities}")

            entities.extend(rekeningen_entities)

        AuditLogging.create(
            action=info.field_name,
            entities=entities,
            after=dict(burger=created_burger),
        )
        return CreateBurger(ok=True, burger=created_burger)
