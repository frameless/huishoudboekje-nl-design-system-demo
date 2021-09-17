""" GraphQL mutation for creating a new Huishouden """

import graphene
import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.huishouden import Huishouden
from hhb_backend.graphql.mutations.burgers.utils import (
    update_existing_burger,
)
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
    log_gebruikers_activiteit,
)


class CreateHuishoudenInput(graphene.InputObjectType):
    burger_ids = graphene.List(graphene.Int, required=False, default_value=[])


class CreateHuishouden(graphene.Mutation):
    class Arguments:
        input = graphene.Argument(CreateHuishoudenInput, required=False)

    ok = graphene.Boolean()
    huishouden = graphene.Field(lambda: Huishouden)

    def gebruikers_activiteit(self, _root, info, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="huishouden", result=self, key="huishouden"
            ),
            after=dict(afspraak=self.huishouden),
        )

    @staticmethod
    @log_gebruikers_activiteit
    async def mutate(_root, _info, input: CreateHuishoudenInput):
        """Create the new Huishouden"""

        response = requests.post(
            f"{settings.HHB_SERVICES_URL}/huishoudens/", json=input
        )
        if response.status_code != 201:
            raise GraphQLError(f"Upstream API responded: {response.text}")
        huishouden = response.json()["data"]

        for burger_id in input.burger_ids:
            burger = await hhb_dataloader().burgers_by_id.load(burger_id)
            if not burger:
                raise GraphQLError(
                    f"Upstream API responded: burger with id {burger_id} does not exist"
                )
            burger["huishouden_id"] = huishouden["id"]

            # TODO: remove this check as it should not be necessary
            burger["iban"] = burger["iban"] if burger["iban"] else ""

            await update_existing_burger(burger=burger)

        return CreateHuishouden(huishouden=huishouden, ok=True)