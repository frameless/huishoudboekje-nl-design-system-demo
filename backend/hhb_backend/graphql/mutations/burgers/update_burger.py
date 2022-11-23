""" GraphQL mutation for updating a Burger """
import graphene
import json
import requests
from graphql import GraphQLError

from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
import hhb_backend.graphql.models.burger as graphene_burger
from hhb_backend.graphql.mutations.huishoudens import huishouden_input as huishouden_input
from hhb_backend.graphql.utils.gebruikersactiviteiten import gebruikers_activiteit_entities
from hhb_backend.service.model import burger


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
        previous = hhb_dataloader().burgers.load_one(id)

        bsn = kwargs.get("bsn")
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

        AuditLogging.create(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="burger", result=updated_burger
            ) + gebruikers_activiteit_entities(
                entity_type="rekening", result=updated_burger, key="rekeningen"
            ),
            before=dict(burger=previous),
            after=dict(burger=updated_burger),
        )

        return UpdateBurger(ok=True, burger=updated_burger, previous=previous)
