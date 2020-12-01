""" GraphQL mutation for creating a new Afspraak """

import graphene
from graphql import GraphQLError
import requests
from hhb_backend.graphql import settings
from hhb_backend.graphql.models.afspraak import Afspraak
from hhb_backend.graphql.mutations.afspraken import AfspraakInput
from hhb_backend.utils import convert_hhb_interval_to_iso
import json

class CreateAfspraak(graphene.Mutation):
    class Arguments:
        input = graphene.Argument(AfspraakInput, required=True)

    ok = graphene.Boolean()
    afspraak = graphene.Field(lambda: Afspraak)

    def mutate(root, info, input, **kwargs):
        """ Create the new Gebruiker/Burger """
        if "interval" in input:
            iso_interval = convert_hhb_interval_to_iso(input["interval"])
            if iso_interval:
                input["interval"] = iso_interval
            else:
                input.pop('interval')
        post_response = requests.post(
            f"{settings.HHB_SERVICES_URL}/afspraken/",
            data=json.dumps(input, default=str),
            headers={'Content-type': 'application/json'}
        )
        if post_response.status_code != 201:
            raise GraphQLError(f"Upstream API responded: {post_response.json()}")
        return CreateAfspraak(afspraak=post_response.json()["data"], ok=True)
