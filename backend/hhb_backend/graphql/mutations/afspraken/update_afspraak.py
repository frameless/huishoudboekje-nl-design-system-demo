""" GraphQL mutation for updating an Afspraak """

import graphene
import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models import Alarm
from hhb_backend.graphql.models.afspraak import Afspraak
from hhb_backend.graphql.scalars.bedrag import Bedrag
from hhb_backend.graphql.utils.gebruikersactiviteiten import (gebruikers_activiteit_entities, log_gebruikers_activiteit)


class UpdateAfspraakInput(graphene.InputObjectType):
    burger_id = graphene.Int()
    afdeling_id = graphene.Int()
    postadres_id = graphene.String()
    alarm_id = graphene.String()
    tegen_rekening_id = graphene.Int()
    rubriek_id = graphene.Int()
    omschrijving = graphene.String()
    credit = graphene.Boolean()
    bedrag = graphene.Argument(Bedrag)
    valid_through = graphene.String()


class UpdateAfspraak(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        input = graphene.Argument(UpdateAfspraakInput, required=True)

    ok = graphene.Boolean()
    afspraak = graphene.Field(lambda: Afspraak)
    previous = graphene.Field(lambda: Afspraak)

    def gebruikers_activiteit(self, _root, info, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="afspraak", result=self, key="afspraak"
            )
            + gebruikers_activiteit_entities(
                entity_type="burger", result=self.afspraak, key="burger_id"
            )
            + gebruikers_activiteit_entities(
                entity_type="afdeling", result=self.afspraak, key="afdeling"
            ),
            before=dict(afspraak=self.previous),
            after=dict(afspraak=self.afspraak),
        )

    @staticmethod
    @log_gebruikers_activiteit
    async def mutate(_root, _info, id: int, input: UpdateAfspraakInput):
        """ Update the Afspraak """

        # check burger_id - optional
        burger_id = input.get("burger_id")
        if burger_id:
            burger: Burger = hhb_dataloader().burger_by_id.load(burger_id)
            if not burger:
                raise GraphQLError("burger not found")

        # Check tegen_rekening_id - optional
        rekening_id = input.get("tegen_rekening_id")
        if rekening_id:
            rekening: Rekening = hhb_dataloader().rekening_by_id.load(rekening_id)
            if not rekening:
                raise GraphQLError("rekening not found")

        # check rubriek_id - optional
        rubriek_id = input.get("rubriek_id")
        if rubriek_id:
            rubriek: Rubriek = hhb_dataloader().rubriek_by_id.load(rubriek_id)
            if not rubriek:
                raise GraphQLError("rubriek not found")

        # check afdeling_id - optional
        afdeling_id = input.get("afdeling_id")
        if afdeling_id is not None:
            afdeling: Afdeling = hhb_dataloader().afdeling_by_id.load(afdeling_id)
            if not afdeling:
                raise GraphQLError("afdeling not found")

        # Check postadres_id - optional
        postadres_id = input.get("postadres_id")
        if postadres_id is not None:
            postadres: Postadres = hhb_dataloader().postadres_by_id.load(postadres_id)
            if not postadres:
                raise GraphQLError("postadres not found")

        # check alarm_id - optional
        alarm_id = input.get("alarm_id")
        if alarm_id is not None:
            alarm: Alarm = hhb_dataloader().alarm_by_id.load(alarm_id)
            if not alarm:
                raise GraphQLError("alarm not found")

        # final update call
        response = requests.post(f"{settings.HHB_SERVICES_URL}/afspraken/{id}", json=input,)
        if not response.ok:
            raise GraphQLError(f"Upstream API responded: {response.text}")
        afspraak = response.json()["data"]
        previous = hhb_dataloader().afspraak_by_id.load(id)

        return UpdateAfspraak(afspraak=afspraak, previous=previous, ok=True)
