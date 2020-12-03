""" GraphQL mutation for updating a Rubriek """

import json
import graphene
from graphql import GraphQLError
import requests
from hhb_backend.graphql import settings
from hhb_backend.graphql.models.rubriek import Rubriek

class UpdateRubriek(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        naam = graphene.String()
        grootboekrekening_id = graphene.String()

    ok = graphene.Boolean()
    rubriek = graphene.Field(lambda: Rubriek)

    def mutate(root, info, **kwargs):
        """ Update a Rubriek """
        rubriek_id = kwargs.pop("id")
        if kwargs["grootboekrekening_id"] and len(requests.get(f"{settings.GROOTBOEK_SERVICE_URL}/grootboekrekeningen/?filter_ids={kwargs['grootboekrekening_id']}").json()['data']) == 0:
            raise GraphQLError(f"Grootboekrekening id [{kwargs['grootboekrekening_id']}] not found.")
        post_response = requests.post(
            f"{settings.HHB_SERVICES_URL}/rubrieken/{rubriek_id}",
            data=json.dumps(kwargs),
            headers={'Content-type': 'application/json'}
        )
        if not post_response.ok:
            raise GraphQLError(f"Upstream API responded: {post_response.json()}")
        return UpdateRubriek(rubriek=post_response.json()["data"], ok=True)
