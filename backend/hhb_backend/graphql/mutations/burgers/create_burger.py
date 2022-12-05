""" GraphQL mutation for creating a new Burger """
import graphene
import json
import requests
from graphql import GraphQLError

import hhb_backend.graphql.mutations.huishoudens.huishouden_input as huishouden_input
import hhb_backend.graphql.mutations.rekeningen.rekening_input as rekening_input
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql import settings
import hhb_backend.graphql.models.burger as graphene_burger
from hhb_backend.graphql.mutations.huishoudens.utils import create_huishouden_if_not_exists
from hhb_backend.graphql.mutations.rekeningen.utils import create_burger_rekening
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity
from hhb_backend.service.model import burger


class CreateBurgerInput(graphene.InputObjectType):
    # burger arguments
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
    huishouden = graphene.Field(huishouden_input.HuishoudenInput)


class CreateBurger(graphene.Mutation):
    class Arguments:
        input = graphene.Argument(CreateBurgerInput)

    ok = graphene.Boolean()
    burger = graphene.Field(lambda: graphene_burger.Burger)

    @staticmethod
    def mutate(self, info, input):
        """ Create the new Gebruiker/Burger """

        graphene_burger.Burger.bsn_length(input.get('bsn'))
        graphene_burger.Burger.bsn_elf_proef(input.get('bsn'))

        rekeningen = input.pop("rekeningen", None)

        huishouden = create_huishouden_if_not_exists(huishouden=input.pop("huishouden", {}))
        input["huishouden_id"] = huishouden.id

        response = requests.post(
            f"{settings.HHB_SERVICES_URL}/burgers/",
            data=json.dumps(input, default=str),
            headers={"Content-type": "application/json"},
        )
        if response.status_code != 201:
            raise GraphQLError(f"Upstream API responded: {response.json()}")

        created_burger = burger.Burger(response.json()["data"])

        if rekeningen:
            created_burger.rekeningen = [
                create_burger_rekening(created_burger.id, rekening)
                for rekening in rekeningen
            ]

        AuditLogging.create(
            action=info.field_name,
            entities=(
                GebruikersActiviteitEntity(entityType="burger", entityId=created_burger.id),
                [
                    GebruikersActiviteitEntity(entityType="rekening", entityId=rekening["id"])
                    for rekening in created_burger.rekeningen
                ]
            ),
            after=dict(burger=created_burger),
        )
        return CreateBurger(ok=True, burger=created_burger)
