""" GraphQL mutation for updating an Afspraak """
import graphene
from graphql import GraphQLError
import requests
from flask import request

from hhb_backend.graphql import settings
from hhb_backend.graphql.models.afspraak import Afspraak, IntervalInput
from hhb_backend.graphql.mutations.afspraken import AfspraakInput
from hhb_backend.graphql.scalars.bedrag import Bedrag
from hhb_backend.graphql.utils import convert_hhb_interval_to_iso
import json

from hhb_backend.graphql.utils.gebruikersactiviteiten import log_gebruikers_activiteit


def item_if(object: dict, path: list):
    return (object[path[0]],) if path[0] in object else ()


class UpdateAfspraak(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        input = graphene.Argument(AfspraakInput, required=True)

    ok = graphene.Boolean()
    afspraak = graphene.Field(lambda: Afspraak)
    previous = graphene.Field(lambda: Afspraak)

    @property
    def gebruikers_activiteit(self):
        return dict(
            action="Update",
            entities=[dict(entity_type="afspraak", entity_id=self.afspraak["id"])]
            + (
                [dict(entity_type="burger", entity_id=self.afspraak["gebruiker"]["id"])]
                if "gebruiker" in self.afspraak
                else []
            )
            + (
                [
                    dict(
                        entity_type="organisatie",
                        entity_id=self.afspraak["organisatie"]["id"],
                    )
                ]
                if "organisatie" in self.afspraak
                else []
            ),
            before=self.previous,
            after=self.afspraak,
        )

    @log_gebruikers_activiteit
    async def mutate(root, info, id, input, **kwargs):
        """ Update the Afspraak """

        previous = await request.dataloader.afspraken_by_id.load(id)

        if "interval" in input:
            iso_interval = convert_hhb_interval_to_iso(input["interval"])
            input["interval"] = iso_interval
        response = requests.post(
            f"{settings.HHB_SERVICES_URL}/afspraken/{id}",
            data=json.dumps(input),
            headers={"Content-type": "application/json"},
        )
        if not response.ok:
            raise GraphQLError(f"Upstream API responded: {response.json()}")

        afspraak = response.json()["data"]

        return UpdateAfspraak(afspraak=afspraak, previous=previous, ok=True)
