""" GraphQL mutation for updating an Afspraak """
import graphene
from graphql import GraphQLError
import requests
from hhb_backend.graphql import settings
from hhb_backend.graphql.models.afspraak import Afspraak, IntervalInput
from hhb_backend.graphql.mutations.afspraken import AfspraakInput
from hhb_backend.graphql.scalars.bedrag import Bedrag
from hhb_backend.graphql.utils import convert_hhb_interval_to_iso
import json

class UpdateAfspraak(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        input = graphene.Argument(AfspraakInput, required=True)

    ok = graphene.Boolean()
    afspraak = graphene.Field(lambda: Afspraak)

    def mutate(root, info, id, input, **kwargs):
        """ Update the Afspraak """
        if "interval" in input:
            iso_interval = convert_hhb_interval_to_iso(input["interval"])
            input["interval"] = iso_interval
        post_response = requests.post(
            f"{settings.HHB_SERVICES_URL}/afspraken/{id}",
            data=json.dumps(input),
            headers={'Content-type': 'application/json'}
        )
        if not post_response.ok:
            raise GraphQLError(f"Upstream API responded: {post_response.json()}")
        return UpdateAfspraak(afspraak=post_response.json()["data"], ok=True)
